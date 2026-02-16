// ============================================================
// /api/assessment/submit - Full autonomous pipeline
// 1. Score lead  2. Save to Supabase  3. Send Day 0 email
// 4. Alert Jermaine  5. Fire Make.com webhook  6. Return results
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { scoreLeadQuality } from "@/lib/lead-scoring";
import {
  calculateOverallScore,
  getQuestionsForSize,
  REPORT_BRANDING,
  DIMENSION_SERVICE_MAP,
  PRIORITY_ACTIONS,
  type CompanySize,
  type Role,
} from "@/lib/assessment-content";
import { emailDay0, emailHotLeadAlert, emailLeadNotification } from "@/lib/email-renderer";
import { sendEmail } from "@/lib/send-email";

const MAKE_WEBHOOK_URL =
  process.env.MAKE_WEBHOOK_URL ||
  "https://hook.us2.make.com/wsneore7j9b7sy6smxpbs0al2mf8ef75";
const CALENDLY_LINK =
  process.env.NEXT_PUBLIC_CALENDLY_LINK ||
  "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";
const JERMAINE_EMAIL = process.env.JERMAINE_EMAIL || "jermaine@jmcbtech.com";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.email || !body.answers || !body.companySize || !body.role) {
    return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
  }

  // ── 1. CALCULATE SCORES (pure computation, no DB needed) ──
  const questions = getQuestionsForSize(body.companySize as CompanySize);
  const overallScore = calculateOverallScore(body.answers as Record<number, number>);
  const answers = body.answers as Record<number, number>;

  const dimensionScores: Record<string, number> = {};
  for (const q of questions) {
    if (answers[q.id] !== undefined) {
      dimensionScores[q.dimension] = answers[q.id];
    }
  }

  const sorted = Object.entries(dimensionScores).sort(([, a], [, b]) => a - b);
  const weakestDimension = sorted[0]?.[0] || "Data Foundation";
  const strongestDimension = sorted[sorted.length - 1]?.[0] || "Strategic Alignment";

  // Legacy 0-50 for backward compat
  const scoreValues = Object.values(answers) as number[];
  const legacyScore = scoreValues.reduce((a, b) => a + b, 0);
  const legacyBand = legacyScore <= 24 ? "early" : legacyScore <= 39 ? "developing" : "advanced";
  const legacyDimensions = questions.map((q) => ({
    title: q.dimension, score: answers[q.id] || 0,
    benchmark: q.benchmarks[body.companySize as CompanySize], phase: q.ascendPhase,
  }));

  // ── 2. SCORE THE LEAD ──
  const leadResult = scoreLeadQuality({
    role: body.role as Role,
    companySize: body.companySize as CompanySize,
    answers,
  });

  // ── 3. REPORT BRANDING & RECOMMENDATIONS ──
  const reportBranding = REPORT_BRANDING[body.companySize as CompanySize] || REPORT_BRANDING["11-50"];
  const priorityActions = PRIORITY_ACTIONS[weakestDimension] || ["Evaluate current capabilities in this area."];
  const serviceRecommendations = sorted
    .filter(([, s]) => s < 3).slice(0, 3)
    .map(([dim]) => ({ dimension: dim, ...(DIMENSION_SERVICE_MAP[dim] || { service: "AI Strategy Session", description: "Personalized guidance.", deliverable: "Action plan" }) }));
  const benchmarks = Object.fromEntries(questions.map((q) => [q.dimension, q.benchmarks[body.companySize as CompanySize]]));

  // ── 4. SAVE TO SUPABASE (isolated - failure won't block emails or response) ──
  let lead: { id: string } | null = null;
  try {
    const supabase = createServerClient();
    console.log("[SUBMIT] Supabase client created, saving lead...");

    const { data: existingLead } = await supabase
      .from("leads").select("id").eq("email", (body.email as string).toLowerCase()).single();

    const leadData = {
      email: (body.email as string).toLowerCase(),
      first_name: body.firstName || null,
      last_name: body.lastName || null,
      organization: body.organization || null,
      role: body.role,
      company_size: body.companySize,
      assessment_score: legacyScore,
      assessment_band: legacyBand,
      assessment_answers: answers,
      assessment_dimensions: legacyDimensions,
      lead_score: leadResult.score,
      lead_score_reason: leadResult.reason,
      overall_score_v2: overallScore,
      dimension_scores_v2: dimensionScores,
      weakest_dimension: weakestDimension,
      strongest_dimension: strongestDimension,
      assessment_completed_at: new Date().toISOString(),
      utm_source: body.utmSource || null,
      utm_medium: body.utmMedium || null,
      utm_campaign: body.utmCampaign || null,
      nurture_sequence_started: true,
      nurture_emails_sent: 1,
    };

    if (existingLead) {
      const { data } = await supabase.from("leads")
        .update({ ...leadData, source: undefined, status: undefined, updated_at: new Date().toISOString() })
        .eq("id", existingLead.id).select().single();
      lead = data;
    } else {
      const { data } = await supabase.from("leads")
        .insert({ ...leadData, source: "ai_readiness_assessment_v2", status: "new" })
        .select().single();
      lead = data;
    }

    console.log(`[SUBMIT] Lead saved: ${lead?.id || "no ID"}`);

    // Assessment results table
    if (lead) {
      try {
        await supabase.from("assessment_results").insert({
          lead_id: lead.id, assessment_type: "ai_readiness",
          score: legacyScore, band: legacyBand,
          answers, dimensions: legacyDimensions,
          recommendations: { priorityActions, serviceRecommendations },
        });
      } catch { /* table may not exist yet */ }
    }

    // Mark partial completions converted
    try {
      await supabase.from("partial_completions")
        .update({ converted_to_lead: true, converted_at: new Date().toISOString() })
        .eq("email", (body.email as string).toLowerCase()).eq("converted_to_lead", false);
    } catch { /* table may not exist yet */ }

    // Increment counter
    try {
      const { data: meta } = await supabase.from("assessment_metadata")
        .select("value").eq("key", "total_assessments").single();
      if (meta) {
        const cnt = ((meta.value as { count: number }).count) || 500;
        await supabase.from("assessment_metadata")
          .update({ value: { count: cnt + 1 }, updated_at: new Date().toISOString() })
          .eq("key", "total_assessments");
      }
    } catch {}

  } catch (supabaseErr) {
    console.error("[SUBMIT] Supabase failed (emails will still send):", supabaseErr);
  }

  // ── 5. BUILD REPORT URL ──
  const reportUrl = lead?.id ? `https://jmcbtech.com/report/${lead.id}` : "";

  // ── 6. SEND EMAILS (always runs, even if Supabase failed) ──
  const emailsSent = { day0: false, notification: false };

  try {
    console.log(`[SUBMIT] Sending Day 0 email to: ${body.email}`);
    const day0 = emailDay0({
      firstName: (body.firstName as string) || "there",
      organization: (body.organization as string) || "your organization",
      overallScore, dimensionScores, weakestDimension, strongestDimension,
      priorityAction: priorityActions[0] || "",
      reportUrl,
    });
    emailsSent.day0 = await sendEmail(body.email as string, day0.subject, day0.html);
    console.log(`[SUBMIT] Day 0 result: ${emailsSent.day0}`);
  } catch (err) {
    console.error("[SUBMIT] Day 0 email exception:", err);
  }

  try {
    console.log(`[SUBMIT] Sending notification to: ${JERMAINE_EMAIL}`);
    const notification = emailLeadNotification({
      firstName: (body.firstName as string) || "",
      lastName: (body.lastName as string) || "",
      email: body.email as string,
      organization: (body.organization as string) || "",
      role: body.role as string,
      companySize: body.companySize as string,
      overallScore, leadScore: leadResult.score,
      weakestDimension, strongestDimension,
      reason: leadResult.reason, reportUrl, dimensionScores,
    });
    emailsSent.notification = await sendEmail(JERMAINE_EMAIL, notification.subject, notification.html);
    console.log(`[SUBMIT] Notification result: ${emailsSent.notification}`);
  } catch (err) {
    console.error("[SUBMIT] Notification email exception:", err);
  }

  // ── 7. MAKE.COM WEBHOOK (async, non-blocking) ──
  fetch(MAKE_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: body.email, firstName: body.firstName, lastName: body.lastName,
      organization: body.organization, role: body.role, companySize: body.companySize,
      overallScore, dimensionScores, weakestDimension, strongestDimension,
      leadScore: leadResult.score, leadId: lead?.id, reportUrl,
    }),
  }).catch(() => {});

  // ── 8. RETURN RESULTS ──
  return NextResponse.json({
    success: true,
    leadId: lead?.id,
    overallScore, dimensionScores, weakestDimension, strongestDimension,
    leadScore: leadResult.score, reportBranding, priorityActions,
    serviceRecommendations, benchmarks, emailsSent,
  });
}
