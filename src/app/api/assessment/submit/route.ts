// ============================================================
// /api/assessment/submit - Full autonomous pipeline
// 1. Score lead  2. Save to Supabase  3. Send Day 0 email
// 4. Alert Jermaine on hot leads  5. Fire Make.com webhook
// 6. Return results to frontend
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
  try {
    const body = await request.json();

    if (!body.email || !body.answers || !body.companySize || !body.role) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServerClient();

    // ── 1. CALCULATE SCORES ──
    const questions = getQuestionsForSize(body.companySize as CompanySize);
    const overallScore = calculateOverallScore(body.answers);

    const dimensionScores: Record<string, number> = {};
    for (const q of questions) {
      if (body.answers[q.id] !== undefined) {
        dimensionScores[q.dimension] = body.answers[q.id];
      }
    }

    const sorted = Object.entries(dimensionScores).sort(([, a], [, b]) => a - b);
    const weakestDimension = sorted[0]?.[0] || "Data Foundation";
    const strongestDimension = sorted[sorted.length - 1]?.[0] || "Strategic Alignment";

    // Legacy 0-50 for backward compat
    const scoreValues = Object.values(body.answers);
    const legacyScore = scoreValues.reduce((a: number, b: number) => a + b, 0);
    const legacyBand = legacyScore <= 24 ? "early" : legacyScore <= 39 ? "developing" : "advanced";
    const legacyDimensions = questions.map((q) => ({
      title: q.dimension, score: body.answers[q.id] || 0,
      benchmark: q.benchmarks[body.companySize as CompanySize], phase: q.ascendPhase,
    }));

    // ── 2. SCORE THE LEAD ──
    const leadResult = scoreLeadQuality({
      role: body.role as Role,
      companySize: body.companySize as CompanySize,
      answers: body.answers,
    });

    // ── 3. REPORT BRANDING ──
    const reportBranding = REPORT_BRANDING[body.companySize as CompanySize] || REPORT_BRANDING["11-50"];
    const priorityActions = PRIORITY_ACTIONS[weakestDimension] || ["Evaluate current capabilities in this area."];
    const serviceRecommendations = sorted
      .filter(([, s]) => s < 3).slice(0, 3)
      .map(([dim]) => ({ dimension: dim, ...(DIMENSION_SERVICE_MAP[dim] || { service: "AI Strategy Session", description: "Personalized guidance.", deliverable: "Action plan" }) }));
    const benchmarks = Object.fromEntries(questions.map((q) => [q.dimension, q.benchmarks[body.companySize as CompanySize]]));

    // ── 4. UPSERT LEAD IN SUPABASE ──
    const { data: existingLead } = await supabase
      .from("leads").select("id").eq("email", body.email.toLowerCase()).single();

    const leadData = {
      email: body.email.toLowerCase(),
      first_name: body.firstName || null,
      last_name: body.lastName || null,
      organization: body.organization || null,
      role: body.role,
      company_size: body.companySize,
      assessment_score: legacyScore,
      assessment_band: legacyBand,
      assessment_answers: body.answers,
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
      // Nurture: mark Day 0 as sent
      nurture_sequence_started: true,
      nurture_emails_sent: 1,
    };

    let lead;
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

    // ── 5. ASSESSMENT RESULTS TABLE ──
    if (lead) {
      await supabase.from("assessment_results").insert({
        lead_id: lead.id, assessment_type: "ai_readiness",
        score: legacyScore, band: legacyBand,
        answers: body.answers, dimensions: legacyDimensions,
        recommendations: { priorityActions, serviceRecommendations },
      }).catch(() => null);
    }

    // ── 6. MARK PARTIAL COMPLETIONS CONVERTED ──
    await supabase.from("partial_completions")
      .update({ converted_to_lead: true, converted_at: new Date().toISOString() })
      .eq("email", body.email.toLowerCase()).eq("converted_to_lead", false).catch(() => null);

    // ── 7. INCREMENT COUNTER ──
    try {
      const { data: meta } = await supabase.from("assessment_metadata")
        .select("value").eq("key", "total_assessments").single();
      if (meta) {
        const cnt = (meta.value as { count: number }).count || 500;
        await supabase.from("assessment_metadata")
          .update({ value: { count: cnt + 1 }, updated_at: new Date().toISOString() })
          .eq("key", "total_assessments");
      }
    } catch {}

    // ── 8. BUILD REPORT URL ──
    const reportUrl = lead?.id ? `https://jmcbtech.com/report/${lead.id}` : "";

    // ── 9. SEND DAY 0 EMAIL (immediate results with report link) ──
    const day0 = emailDay0({
      firstName: body.firstName || "there",
      organization: body.organization || "your organization",
      overallScore, dimensionScores, weakestDimension, strongestDimension,
      priorityAction: priorityActions[0] || "",
      reportUrl,
    });
    await sendEmail(body.email, day0.subject, day0.html);

    // ── 10. NOTIFY JERMAINE ON EVERY SUBMISSION ──
    const notification = emailLeadNotification({
      firstName: body.firstName || "", lastName: body.lastName || "",
      email: body.email, organization: body.organization || "",
      role: body.role, companySize: body.companySize,
      overallScore, leadScore: leadResult.score,
      weakestDimension, strongestDimension,
      reason: leadResult.reason, reportUrl, dimensionScores,
    });
    await sendEmail(JERMAINE_EMAIL, notification.subject, notification.html);

    // ── 11. MAKE.COM WEBHOOK (async, non-blocking) ──
    fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: lead?.id, firstName: body.firstName, lastName: body.lastName,
        email: body.email, organization: body.organization,
        companySize: body.companySize, role: body.role,
        score: legacyScore, band: legacyBand,
        overallScore, dimensionScores, weakestDimension, strongestDimension,
        leadScore: leadResult.score, reportBranding, priorityActions,
        serviceRecommendations, calendlyUrl: CALENDLY_LINK,
        timestamp: new Date().toISOString(),
      }),
    }).catch((err) => console.error("Make.com webhook error:", err));

    // ── 12. RETURN TO FRONTEND ──
    return NextResponse.json({
      success: true,
      leadId: lead?.id,
      overallScore, dimensionScores, weakestDimension, strongestDimension,
      leadScore: leadResult.score, reportBranding, priorityActions,
      serviceRecommendations, benchmarks,
    });
  } catch (error) {
    console.error("Assessment submit error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
