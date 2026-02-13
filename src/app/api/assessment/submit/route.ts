// ============================================================
// /api/assessment/submit/route.ts
// Full assessment submission: score lead, store, trigger webhooks
// Uses existing createServerClient() from @/lib/supabase
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { scoreLeadQuality, shouldNotifyImmediately } from "@/lib/lead-scoring";
import {
  calculateOverallScore,
  getQuestionsForSize,
  REPORT_BRANDING,
  DIMENSION_SERVICE_MAP,
  PRIORITY_ACTIONS,
  type CompanySize,
  type Role,
} from "@/lib/assessment-content";

const MAKE_WEBHOOK_URL =
  process.env.MAKE_WEBHOOK_URL ||
  "https://hook.us2.make.com/wsneore7j9b7sy6smxpbs0al2mf8ef75";
const MAKE_NURTURE_WEBHOOK_URL = process.env.MAKE_NURTURE_WEBHOOK_URL || "";
const MAKE_NOTIFICATION_WEBHOOK_URL =
  process.env.MAKE_NOTIFICATION_WEBHOOK_URL || "";
const CALENDLY_LINK =
  process.env.NEXT_PUBLIC_CALENDLY_LINK ||
  "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";

interface SubmitPayload {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  companySize: CompanySize;
  role: Role;
  answers: Record<string, number>;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitPayload = await request.json();

    if (!body.email || !body.answers || !body.companySize || !body.role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // ── 1. SCORE THE LEAD ──
    const leadScoring = scoreLeadQuality({
      role: body.role,
      companySize: body.companySize,
      answers: body.answers,
    });

    // ── 2. CALCULATE DIMENSION SCORES ──
    const questions = getQuestionsForSize(body.companySize);
    const dimensionScores: Record<string, number> = {};

    for (const q of questions) {
      if (body.answers[q.id] !== undefined) {
        dimensionScores[q.dimension] = body.answers[q.id];
      }
    }

    const overallScore = calculateOverallScore(body.answers);

    // Find weakest and strongest
    const sortedDimensions = Object.entries(dimensionScores).sort(
      ([, a], [, b]) => a - b
    );
    const weakestDimension = sortedDimensions[0]?.[0] || "Data Foundation";
    const strongestDimension =
      sortedDimensions[sortedDimensions.length - 1]?.[0] || "Data Foundation";

    // Calculate legacy 0-50 score for backward compatibility
    const scoreValues = Object.values(body.answers);
    const legacyScore = scoreValues.reduce((a, b) => a + b, 0);
    const legacyBand =
      legacyScore <= 24 ? "early" : legacyScore <= 39 ? "developing" : "advanced";

    // Build legacy dimension format for existing table column
    const legacyDimensions = questions.map((q) => ({
      title: q.dimension,
      score: body.answers[q.id] || 0,
      benchmark: q.benchmarks[body.companySize],
      phase: q.ascendPhase,
    }));

    // ── 3. CHECK IF LEAD EXISTS (upsert) ──
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id")
      .eq("email", body.email.toLowerCase())
      .single();

    let lead;

    if (existingLead) {
      const { data, error } = await supabase
        .from("leads")
        .update({
          first_name: body.firstName,
          last_name: body.lastName,
          organization: body.organization || null,
          role: body.role,
          company_size: body.companySize,
          // Legacy columns (backward compatible)
          assessment_score: legacyScore,
          assessment_band: legacyBand,
          assessment_answers: body.answers,
          assessment_dimensions: legacyDimensions,
          // New v2 columns
          lead_score: leadScoring.score,
          lead_score_reason: leadScoring.reason,
          overall_score_v2: overallScore,
          dimension_scores_v2: dimensionScores,
          weakest_dimension: weakestDimension,
          strongest_dimension: strongestDimension,
          assessment_completed_at: new Date().toISOString(),
          // UTM
          utm_source: body.utmSource || null,
          utm_medium: body.utmMedium || null,
          utm_campaign: body.utmCampaign || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingLead.id)
        .select()
        .single();

      if (error) throw error;
      lead = data;
    } else {
      const { data, error } = await supabase
        .from("leads")
        .insert({
          email: body.email.toLowerCase(),
          first_name: body.firstName,
          last_name: body.lastName,
          organization: body.organization || null,
          role: body.role,
          company_size: body.companySize,
          source: "ai_readiness_assessment_v2",
          status: "new",
          // Legacy columns
          assessment_score: legacyScore,
          assessment_band: legacyBand,
          assessment_answers: body.answers,
          assessment_dimensions: legacyDimensions,
          // New v2 columns
          lead_score: leadScoring.score,
          lead_score_reason: leadScoring.reason,
          overall_score_v2: overallScore,
          dimension_scores_v2: dimensionScores,
          weakest_dimension: weakestDimension,
          strongest_dimension: strongestDimension,
          assessment_completed_at: new Date().toISOString(),
          // UTM
          utm_source: body.utmSource || null,
          utm_medium: body.utmMedium || null,
          utm_campaign: body.utmCampaign || null,
        })
        .select()
        .single();

      if (error) throw error;
      lead = data;
    }

    // ── 4. ALSO SAVE TO assessment_results TABLE ──
    try {
      await supabase.from("assessment_results").insert({
        lead_id: lead.id,
        assessment_type: "ai_readiness",
        score: legacyScore,
        band: legacyBand,
        answers: body.answers,
        dimensions: legacyDimensions,
      });
    } catch (err) {
      console.error("Assessment results insert error:", err);
    }

    // ── 5. MARK PARTIAL COMPLETION AS CONVERTED ──
    await supabase
      .from("partial_completions")
      .update({
        converted_to_lead: true,
        converted_at: new Date().toISOString(),
      })
      .eq("email", body.email.toLowerCase())
      .eq("converted_to_lead", false);

    // ── 6. INCREMENT ASSESSMENT COUNTER ──
    try {
      const { data: metadata } = await supabase
        .from("assessment_metadata")
        .select("value")
        .eq("key", "total_assessments")
        .single();

      if (metadata) {
        const currentCount = (metadata.value as { count: number }).count || 500;
        await supabase
          .from("assessment_metadata")
          .update({
            value: { count: currentCount + 1 },
            updated_at: new Date().toISOString(),
          })
          .eq("key", "total_assessments");
      }
    } catch (err) {
      console.error("Metadata update error:", err);
    }

    // ── 7. TRIGGER MAKE.COM WEBHOOK ──
    const reportBranding = REPORT_BRANDING[body.companySize];
    const priorityActions = PRIORITY_ACTIONS[weakestDimension] || [];

    const serviceRecommendations = sortedDimensions
      .filter(([, score]) => score < 3)
      .map(([dim]) => ({
        dimension: dim,
        ...DIMENSION_SERVICE_MAP[dim],
      }));

    try {
      await fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          organization: body.organization,
          companySize: body.companySize,
          role: body.role,
          score: legacyScore,
          band: legacyBand,
          overallScore,
          dimensions: legacyDimensions,
          dimensionScores,
          weakestDimension,
          strongestDimension,
          leadScore: leadScoring.score,
          reportBranding,
          priorityActions,
          serviceRecommendations,
          calendlyUrl: CALENDLY_LINK,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Make.com webhook error:", err);
    }

    // ── 8. TRIGGER NURTURE SEQUENCE (if configured) ──
    if (MAKE_NURTURE_WEBHOOK_URL) {
      try {
        await fetch(MAKE_NURTURE_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leadId: lead.id,
            email: body.email,
            firstName: body.firstName,
            organization: body.organization,
            companySize: body.companySize,
            overallScore,
            weakestDimension,
            strongestDimension,
            reportBranding: reportBranding.title,
            priorityAction: priorityActions[0] || "",
            calendlyLink: CALENDLY_LINK,
          }),
        });

        await supabase
          .from("leads")
          .update({ nurture_sequence_started: true })
          .eq("id", lead.id);
      } catch (err) {
        console.error("Nurture webhook error:", err);
      }
    }

    // ── 9. HOT LEAD NOTIFICATION ──
    if (shouldNotifyImmediately(leadScoring) && MAKE_NOTIFICATION_WEBHOOK_URL) {
      try {
        await fetch(MAKE_NOTIFICATION_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "HOT_LEAD",
            leadId: lead.id,
            name: `${body.firstName} ${body.lastName}`,
            email: body.email,
            organization: body.organization,
            companySize: body.companySize,
            role: body.role,
            overallScore,
            weakestDimension,
            urgencySignals: leadScoring.urgencySignals,
            reason: leadScoring.reason,
          }),
        });
      } catch (err) {
        console.error("Hot lead notification error:", err);
      }
    }

    // ── 10. RETURN RESULTS TO FRONTEND ──
    return NextResponse.json({
      success: true,
      leadId: lead.id,
      overallScore,
      dimensionScores,
      weakestDimension,
      strongestDimension,
      leadScore: leadScoring.score,
      reportBranding,
      priorityActions,
      serviceRecommendations,
      benchmarks: Object.fromEntries(
        questions.map((q) => [q.dimension, q.benchmarks[body.companySize]])
      ),
    });
  } catch (error) {
    console.error("Assessment submit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
