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
import { PROGRAM_NAME, WEEKS } from "@/lib/program";
import { flattenSkills, verifyRewrites, type ResumeExtraction } from "@/lib/resume";

// Generates the personalised half of the Career Compass result: a written read
// of where this person stands, a 90-day plan, and — when they gave us a CV —
// a reformatted CV and a training focus aimed at their actual gaps.
//
// Called from the results screen after the deterministic scores are already on
// screen, so a slow or failed generation degrades to the instant results
// rather than blocking them. Every failure path returns a usable written
// fallback — a job seeker must never see an empty report.
//
// Uses raw fetch against the Messages API to match
// src/app/api/assessment/report/route.ts, which avoids taking on the
// @anthropic-ai/sdk dependency for a single call. Keep the two consistent.

export const maxDuration = 60;

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-opus-5";

interface ReportRequest {
  firstName?: string;
  score?: number;
  dimensionScores?: Record<string, number>;
  preferences?: Record<string, string | string[]>;
  targetTitle?: string;
  resume?: ResumeExtraction | null;
  /** The applicant's own CV text, returned by the resume route. Rewrites are
   *  checked against it so none can introduce a line or a figure the CV
   *  does not contain. */
  sourceText?: string | null;
}

function labelFor(fieldId: string, value: string | string[]): string {
  const field = PREFERENCE_FIELDS.find((f) => f.id === fieldId);
  if (!field) return Array.isArray(value) ? value.join(", ") : String(value);
  const lookup = (v: string) => field.options.find((o) => o.value === v)?.label ?? v;
  return Array.isArray(value) ? value.map(lookup).join(", ") : lookup(value);
}

/**
 * Deterministic training focus: maps the two weakest dimensions onto the
 * programme weeks that address them. Computed rather than generated so the
 * week numbers are always real, even when generation fails.
 */
const DIMENSION_TO_WEEKS: Record<CompassDimension, number[]> = {
  Clarity: [1],
  Offer: [1, 7],
  Momentum: [5],
  Proof: [1, 5, 8],
  "AI Fluency": [2, 3, 6],
  Signal: [8],
  "Search Mechanics": [4, 7],
};

function trainingFocusFor(weakest: CompassDimension[]) {
  // Array.from rather than spreading a Set — the project's tsconfig target
  // predates downlevelIteration.
  const weekNumbers = Array.from(
    new Set(weakest.flatMap((d) => DIMENSION_TO_WEEKS[d] ?? []))
  ).sort((a, b) => a - b);
  return weekNumbers
    .map((n) => WEEKS.find((w) => w.week === n))
    .filter((w): w is (typeof WEEKS)[number] => Boolean(w))
    .map((w) => ({ week: w.week, project: w.project, theme: w.theme }));
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
    const resume = body.resume ?? null;
    const sourceText = typeof body.sourceText === "string" ? body.sourceText : "";
    const band = getBand(score);
    const ranked = rankDimensions(dimensionScores);
    const weakest = ranked.slice(0, 2);
    const training = trainingFocusFor(weakest);

    // Deterministic fallback, also the floor the model is asked to beat.
    const fallback = {
      summary: `${firstName}, you scored ${score} out of 100 — ${band.label.toLowerCase()}. ${band.summary} Your two weakest areas are ${weakest.join(" and ")}, and they're where the next month of effort should go. Everything else can wait.`,
      plan: weakest.map((d) => ({
        dimension: d,
        diagnosis: DIMENSION_ACTIONS[d]?.diagnosis ?? "",
        thisWeek: DIMENSION_ACTIONS[d]?.week1 ?? "",
      })),
      training,
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

    const skills = flattenSkills(resume);
    const cvBlock = resume
      ? `They gave us their CV. Here is what it actually evidences:
- Most recent title: ${resume.currentTitle || "not stated"}
- Years of experience: ${resume.yearsExperience ?? "unclear"}
- Industries: ${resume.industries?.join(", ") || "not stated"}
- Skills evidenced: ${skills.join(", ") || "none clearly evidenced"}
- Achievements already carrying a number: ${resume.quantifiedAchievements?.map((a) => a.value).join(" | ") || "none"}
- Claims with no figure attached: ${resume.unquantifiedClaims?.map((a) => a.value).join(" | ") || "none"}
- Problems with the CV: ${resume.atsIssues?.join(" | ") || "none found"}
- Missing for their target: ${resume.missingForTarget?.join(", ") || "nothing obvious"}`
      : "They did not give us a CV, so write the resume section as null.";

    const prompt = `You are Jermaine Barker, founder of JMCB Technology Group, writing directly to a job seeker who has just finished the ${ASSESSMENT_NAME} assessment.

Their name: ${firstName}
Overall readiness: ${score}/100 (${band.label})
${body.targetTitle ? `The exact job title they want: ${body.targetTitle}` : ""}

What they told us they want:
${wants || "- (not stated)"}

Their COMPASS scores, out of 5:
${dims}

Their two weakest areas: ${weakest.join(", ")}.

${cvBlock}

Write four things.

1. summary: a direct read, three short paragraphs. Speak to what THEY said they want. If they gave a CV, connect what it evidences to what they are aiming at — say plainly whether the gap is real. If their target and their readiness don't match, say so kindly and without hedging. Do not flatter.

2. phases: a 90-day plan of exactly three phases (days 1-30, 31-60, 61-90). Each gets a title and two sentences of specific instruction tied to their actual answers, their actual target, and their actual CV.

3. resume: ${resume ? `a concrete reformat of THEIR CV, not generic advice. Include:
   - headline: the one-line title and positioning statement that should sit at the top, aimed at their target role.
   - summary: a two to three sentence professional summary written in their voice, using what the CV evidences.
   - skillsSection: the skills to list, ordered by what their target role screens for, using the wording adverts actually use. Only skills the CV supports.
   - bulletRewrites: up to five of their weak or unquantified lines rewritten. For each give "before" (close to what they wrote), "after" (the rewritten line), and "note" (one sentence on what changed and what number they need to supply, using [X] as a placeholder where only they know the figure).
   - fixes: the structural changes to make, specific to this CV.` : "null, because they gave us no CV."}

4. training: one short paragraph, keyed "trainingWhy", saying which parts of ${PROGRAM_NAME} matter most for this specific person and why, given their weakest dimensions (${weakest.join(", ")}) and their CV. Do not list every week. Be specific about what they'd walk out with.

Rules: no em dashes or en dashes. Use contractions. No corporate jargon, no "leverage", no "journey". Vary sentence length. Write like a person who has done this, not a careers website.

GROUNDING, which matters more than style: every "before" line must be copied VERBATIM from the CV text above. Never write a figure that is not already in the CV — where a number is needed and only they can supply it, write [X]. Rewrites whose "before" cannot be found in the CV, or which introduce an unsourced figure, are discarded before the applicant sees them, so a fabricated line is worse than no line.

Respond ONLY with JSON in exactly this shape, no prose outside it:
{"summary":"...","phases":[{"title":"Days 1-30: ...","body":"..."},{"title":"Days 31-60: ...","body":"..."},{"title":"Days 61-90: ...","body":"..."}],"resume":{"headline":"...","summary":"...","skillsSection":["..."],"bulletRewrites":[{"before":"...","after":"...","note":"..."}],"fixes":["..."]},"trainingWhy":"..."}`;

    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        // Larger than the pre-CV version: the reformat carries the bullet
        // rewrites, which are the longest part of the response.
        max_tokens: 8000,
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

    const text = data.content?.find((b: { type: string }) => b.type === "text")?.text ?? "";
    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let parsedReport: {
      summary?: string;
      phases?: { title: string; body: string }[];
      resume?: unknown;
      trainingWhy?: string;
    };
    try {
      parsedReport = JSON.parse(cleaned);
    } catch {
      logError("career-report", new Error("model returned unparseable JSON"));
      return NextResponse.json({ ...fallback, generated: false });
    }

    if (!parsedReport.summary || !Array.isArray(parsedReport.phases) || !parsedReport.phases.length) {
      return NextResponse.json({ ...fallback, generated: false });
    }

    // Drop any rewrite that isn't traceable to the CV. Without source text we
    // cannot verify, so we return no rewrites rather than unchecked ones.
    let rewriteResult: { resume: unknown; droppedRewrites: number } = {
      resume: null,
      droppedRewrites: 0,
    };
    if (resume && parsedReport.resume && typeof parsedReport.resume === "object") {
      const r = parsedReport.resume as Record<string, unknown>;
      const { kept, dropped } = verifyRewrites(
        r.bulletRewrites as { before: string; after: string; note: string }[] | undefined,
        sourceText
      );
      rewriteResult = {
        resume: { ...r, bulletRewrites: kept },
        droppedRewrites: dropped,
      };
      if (dropped) logError("career-report", new Error(`dropped ${dropped} unverifiable rewrites`));
    }

    return NextResponse.json({
      summary: parsedReport.summary,
      phases: parsedReport.phases.slice(0, 3),
      plan: fallback.plan,
      // Week numbers stay deterministic; only the reasoning is generated.
      training,
      trainingWhy: typeof parsedReport.trainingWhy === "string" ? parsedReport.trainingWhy : null,
      resume: rewriteResult.resume,
      droppedRewrites: rewriteResult.droppedRewrites,
      generated: true,
    });
  } catch (error) {
    logError("career-report", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
