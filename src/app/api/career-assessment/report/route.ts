import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logError } from "@/lib/logger";
import {
  ASSESSMENT_NAME,
  PREFERENCE_FIELDS,
  DIMENSION_ACTIONS,
  getBand,
  rankDimensions,
  type CompassDimension,
} from "@/lib/career-assessment";
import { PROGRAM_NAME } from "@/lib/program";

// Generates the personalised half of the Career Compass result: a written
// read of where this specific person stands and a 90-day plan.
//
// Called from the results screen after the deterministic scores are already
// on screen, so a slow or failed generation degrades to the instant results
// rather than blocking them. Every failure path returns a usable written
// fallback — a job seeker must never see an empty report.
//
// Uses raw fetch against the Messages API to match
// src/app/api/assessment/report/route.ts, which avoids taking on the
// @anthropic-ai/sdk dependency for a single call. Keep the two consistent.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-opus-5";

interface ReportRequest {
  firstName?: string;
  score?: number;
  dimensionScores?: Record<string, number>;
  preferences?: Record<string, string | string[]>;
  targetTitle?: string;
}

function labelFor(fieldId: string, value: string | string[]): string {
  const field = PREFERENCE_FIELDS.find((f) => f.id === fieldId);
  if (!field) return Array.isArray(value) ? value.join(", ") : String(value);
  const lookup = (v: string) => field.options.find((o) => o.value === v)?.label ?? v;
  return Array.isArray(value) ? value.map(lookup).join(", ") : lookup(value);
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`career-report:${ip}`, 5, 60_000);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many requests, slow down" }, { status: 429 });
    }

    const body: ReportRequest = await request.json();
    const firstName = body.firstName || "there";
    const score = typeof body.score === "number" ? body.score : 0;
    const dimensionScores = (body.dimensionScores || {}) as Record<CompassDimension, number>;
    const preferences = body.preferences || {};
    const band = getBand(score);
    const ranked = rankDimensions(dimensionScores);
    const weakest = ranked.slice(0, 2);

    // Deterministic fallback, also used as the base the model is asked to beat.
    const fallback = {
      summary: `${firstName}, you scored ${score} out of 100 — ${band.label.toLowerCase()}. ${band.summary} Your two weakest areas are ${weakest.join(" and ")}, and they're where the next month of effort should go. Everything else can wait.`,
      plan: weakest.map((d) => ({
        dimension: d,
        diagnosis: DIMENSION_ACTIONS[d]?.diagnosis ?? "",
        thisWeek: DIMENSION_ACTIONS[d]?.week1 ?? "",
      })),
    };

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ ...fallback, generated: false });
    }

    const wants = PREFERENCE_FIELDS.filter((f) => preferences[f.id])
      .map((f) => `- ${f.question} ${labelFor(f.id, preferences[f.id])}`)
      .join("\n");
    const dims = Object.entries(dimensionScores)
      .map(([d, v]) => `- ${d}: ${v}/5`)
      .join("\n");

    const prompt = `You are Jermaine Barker, founder of JMCB Technology Group, writing directly to a job seeker who has just finished the ${ASSESSMENT_NAME} assessment.

Their name: ${firstName}
Overall readiness: ${score}/100 (${band.label})
${body.targetTitle ? `The exact job title they want: ${body.targetTitle}` : ""}

What they told us they want:
${wants || "- (not stated)"}

Their COMPASS scores, out of 5:
${dims}

Their two weakest areas: ${weakest.join(", ")}.

Write two things.

1. A direct summary, three short paragraphs. Speak to what THEY said they want, by name — if they want remote work at a certain salary on a certain timeline, address whether their current profile supports that, honestly. If their target and their readiness don't match, say so plainly and kindly. Do not flatter. Do not hedge. This person needs the truth more than encouragement.

2. A 90-day plan of exactly three phases (days 1-30, 31-60, 61-90). Each phase gets a title and two sentences of specific instruction tied to their actual answers and their actual target role. Concrete actions, not categories.

Rules: no em dashes or en dashes. Use contractions. No corporate jargon, no "leverage", no "journey". Vary sentence length. Write like a person who has done this, not a careers website. Mention ${PROGRAM_NAME} at most once, and only if it genuinely fits their gaps.

Respond ONLY with JSON in exactly this shape, no prose outside it:
{"summary": "...", "phases": [{"title": "Days 1-30: ...", "body": "..."}, {"title": "Days 31-60: ...", "body": "..."}, {"title": "Days 61-90: ...", "body": "..."}]}`;

    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4000,
        // Adaptive thinking is on by default for this model. Medium effort
        // keeps the round trip short enough for a page the user is waiting on.
        output_config: { effort: "medium" },
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      logError("career-report", new Error(`Anthropic ${res.status}: ${await res.text()}`));
      return NextResponse.json({ ...fallback, generated: false });
    }

    const data = await res.json();

    // A safety refusal returns HTTP 200 — check before reading content.
    if (data.stop_reason === "refusal") {
      logError("career-report", new Error("model declined to generate report"));
      return NextResponse.json({ ...fallback, generated: false });
    }

    const text =
      data.content?.find((b: { type: string }) => b.type === "text")?.text ?? "";
    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let parsedReport: { summary?: string; phases?: { title: string; body: string }[] };
    try {
      parsedReport = JSON.parse(cleaned);
    } catch {
      logError("career-report", new Error("model returned unparseable JSON"));
      return NextResponse.json({ ...fallback, generated: false });
    }

    if (!parsedReport.summary || !Array.isArray(parsedReport.phases) || !parsedReport.phases.length) {
      return NextResponse.json({ ...fallback, generated: false });
    }

    return NextResponse.json({
      summary: parsedReport.summary,
      phases: parsedReport.phases.slice(0, 3),
      plan: fallback.plan,
      generated: true,
    });
  } catch (error) {
    logError("career-report", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
