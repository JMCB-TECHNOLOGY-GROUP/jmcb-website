// ============================================================
// /api/assessment/report/route.ts
// Generates AI-powered executive summary using Claude API
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import {
  REPORT_BRANDING,
  DIMENSION_SERVICE_MAP,
  PRIORITY_ACTIONS,
  type CompanySize,
} from "@/lib/assessment-content";

interface ReportRequest {
  firstName: string;
  lastName: string;
  organization: string;
  companySize: CompanySize;
  role: string;
  overallScore: number;
  dimensionScores: Record<string, number>;
  weakestDimension: string;
  strongestDimension: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ReportRequest = await request.json();
    const {
      firstName,
      lastName,
      organization,
      companySize,
      overallScore,
      dimensionScores,
      weakestDimension,
      strongestDimension,
    } = body;

    const branding = REPORT_BRANDING[companySize];
    const dimensionBreakdown = Object.entries(dimensionScores)
      .map(([dim, score]) => `- ${dim}: ${score}/5`)
      .join("\n");

    // ── GENERATE WITH CLAUDE API (if key configured) ──
    let executiveSummary = "";
    let recommendations: { dimension: string; score: number; recommendation: string }[] = [];

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        // Use fetch directly to avoid @anthropic-ai/sdk dependency
        const summaryRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-5-20250929",
            max_tokens: 800,
            messages: [
              {
                role: "user",
                content: `You are writing the executive summary for an AI Readiness Assessment report for ${organization} (${companySize} employees). Write as Jermaine Barker, Founder of JMCB Technology Group.

Assessment Results:
- Overall Score: ${overallScore}/100
- Company: ${organization}
- Size: ${companySize} employees
- Weakest Dimension: ${weakestDimension}
- Strongest Dimension: ${strongestDimension}
- Dimension Scores:
${dimensionBreakdown}

Write 2-3 paragraphs. No em dashes or en dashes. Use contractions. No corporate jargon. Vary sentence length. Sound like a real consultant, not a template.`,
              },
            ],
          }),
        });

        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          executiveSummary =
            summaryData.content?.[0]?.type === "text"
              ? summaryData.content[0].text
              : "";
        }

        const recsRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-5-20250929",
            max_tokens: 1500,
            messages: [
              {
                role: "user",
                content: `Write personalized recommendations for ${organization} (${companySize} employees).

Scores:
${dimensionBreakdown}

For each dimension, write exactly 2 sentences: one diagnosing where they are, one recommending what to do next. Be specific. No em dashes. Use contractions.

Respond ONLY with a JSON array:
[{"dimension": "...", "score": N, "recommendation": "Two sentences."}]`,
              },
            ],
          }),
        });

        if (recsRes.ok) {
          const recsData = await recsRes.json();
          const recsText =
            recsData.content?.[0]?.type === "text"
              ? recsData.content[0].text
              : "[]";
          const cleaned = recsText
            .replace(/```json\s*/g, "")
            .replace(/```\s*/g, "")
            .trim();
          recommendations = JSON.parse(cleaned);
        }
      } catch (aiError) {
        console.error("Claude API error:", aiError);
      }
    }

    // Fallback if AI generation failed
    if (!executiveSummary) {
      const scoreLabel =
        overallScore >= 70 ? "strong" : overallScore >= 40 ? "developing" : "early-stage";
      executiveSummary = `${organization} scored ${overallScore} out of 100 on the JMCB AI Readiness Assessment, placing it in the ${scoreLabel} category. The strongest area is ${strongestDimension}, which provides a solid foundation to build on. The biggest opportunity for improvement is ${weakestDimension}, and addressing this gap should be the immediate priority for the next 30 days.`;
    }

    if (recommendations.length === 0) {
      recommendations = Object.entries(dimensionScores).map(([dim, score]) => ({
        dimension: dim,
        score,
        recommendation: `Your score of ${score}/5 in ${dim} indicates ${score <= 2 ? "significant opportunity for growth" : score <= 3 ? "a solid foundation to build on" : "strong capability"}. ${PRIORITY_ACTIONS[dim]?.[0] || "Focus on incremental improvements in this area."}`,
      }));
    }

    // ── BUILD REPORT STRUCTURE ──
    const priorityActions = PRIORITY_ACTIONS[weakestDimension] || [];
    const serviceRecommendations = Object.entries(dimensionScores)
      .filter(([, score]) => score < 3)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 3)
      .map(([dim]) => ({ dimension: dim, ...DIMENSION_SERVICE_MAP[dim] }));

    return NextResponse.json({
      success: true,
      reportData: {
        reportTitle: branding.title,
        reportSubtitle: branding.subtitle,
        organization,
        assessmentDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        overallScore,
        executiveSummary,
        dimensions: recommendations,
        priorityFocus: weakestDimension,
        priorityActions: priorityActions.slice(0, 3),
        serviceRecommendations,
        preparedFor: `${firstName} ${lastName}`,
        preparedBy: "Jermaine Barker, JMCB Technology Group",
      },
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
