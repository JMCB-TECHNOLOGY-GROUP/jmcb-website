// ============================================================
// src/lib/career-crosscheck.ts — reads the CV against the COMPASS answers.
//
// The assessment asks how someone rates themselves. The CV shows what they
// have actually put on paper. Four COMPASS questions can be checked against
// the CV directly, and where the two disagree by two or more rungs on the
// 1-5 ladder that gap is the most useful thing in the whole report: either
// the CV is behind what they can do, or the answer was generous. Both have
// the same fix, and both are worth saying out loud.
//
// Everything here is deterministic and computed from the VERIFIED extraction
// (see lib/resume.ts), so every "the CV shows" statement is traceable to
// text that is really in the document. No model call.
//
// Consumed by /career-assessment (results screen), /api/career-assessment/
// report (fed into the written read) and /api/career-assessment/submit
// (lead notes and the alert email).
// ============================================================

import { COMPASS_QUESTIONS, type CompassDimension } from "./career-assessment";
import { flattenSkills, type ResumeExtraction } from "./resume";

/** Where the CV alone would place someone on one question's 1-5 ladder. */
export type CvCheck = {
  questionId: string;
  dimension: CompassDimension;
  cvScore: number;
  /** What the CV shows, in plain words. Every figure comes from the extraction. */
  evidence: string;
};

export type Discrepancy = CvCheck & {
  questionText: string;
  selfScore: number;
  selfLabel: string;
  cvLabel: string;
  /** "cv-lower": they rated themselves above what the CV shows. "cv-higher": below. */
  direction: "cv-lower" | "cv-higher";
  advice: string;
};

/** The questions the CV can speak to. Exported so the UI can mark them. */
export const CROSS_CHECKED_QUESTIONS: readonly string[] = ["o1", "p2", "sm1", "a1"];

/** A self-rating this far from the CV's reading is worth calling out. */
export const DISCREPANCY_THRESHOLD = 2;

// Deliberately broad: a CV that says "automated the weekly report" evidences
// AI/automation fluency even without naming a product. "agent" and "ml" are
// left out on purpose: estate agents and millilitres are not AI work.
const AI_TERMS =
  /\b(ai|artificial intelligence|llms?|large language models?|chatgpt|gpt(?:-?[0-9o]+)?|claude|copilot|gemini|prompt(?:s|ing)?|machine learning|automat(?:ed|ion|ing)|zapier|make\.com|n8n|power automate|rpa)\b/i;

const clamp = (n: number) => Math.min(5, Math.max(1, n));

function questionFor(id: string) {
  return COMPASS_QUESTIONS.find((q) => q.id === id);
}

export function optionLabel(questionId: string, value: number): string {
  return questionFor(questionId)?.options.find((o) => o.value === value)?.label ?? String(value);
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/**
 * The extraction arrives from two places: the browser (typed ResumeExtraction)
 * and the submit route (zod-parsed, where every field may be null). Accept the
 * loose shape and reduce it to what the checks need.
 */
export type CrossCheckInput =
  | {
      skillGroups?: { category?: string | null; skills?: { value?: string | null }[] | null }[] | null;
      quantifiedAchievements?: { value?: string | null; evidence?: string | null }[] | null;
      unquantifiedClaims?: { value?: string | null; evidence?: string | null }[] | null;
      atsIssues?: (string | null)[] | null;
    }
  | null
  | undefined;

function tidy(input: CrossCheckInput): ResumeExtraction | null {
  if (!input) return null;
  const evidenced = (items: { value?: string | null; evidence?: string | null }[] | null | undefined) =>
    (items ?? [])
      .filter((i): i is { value: string; evidence?: string | null } => typeof i?.value === "string" && i.value.trim() !== "")
      .map((i) => ({ value: i.value.trim(), evidence: (i.evidence ?? "").trim() }));
  return {
    skillGroups: (input.skillGroups ?? []).map((g) => ({
      category: g?.category ?? "Skills",
      skills: evidenced(g?.skills),
    })),
    quantifiedAchievements: evidenced(input.quantifiedAchievements),
    unquantifiedClaims: evidenced(input.unquantifiedClaims),
    atsIssues: (input.atsIssues ?? []).filter((s): s is string => typeof s === "string" && s.trim() !== ""),
  };
}

/** Skills and claims on the CV that read as AI or automation work. */
export function aiMentions(input: CrossCheckInput): string[] {
  const extraction = tidy(input);
  if (!extraction) return [];
  const candidates = [
    ...flattenSkills(extraction),
    ...(extraction.quantifiedAchievements ?? []).map((a) => a.value),
    ...(extraction.unquantifiedClaims ?? []).map((a) => a.value),
  ];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const c of candidates) {
    const key = c.toLowerCase();
    if (AI_TERMS.test(c) && !seen.has(key)) {
      seen.add(key);
      out.push(c);
    }
  }
  return out;
}

/**
 * Reads the verified extraction against the four checkable questions.
 * Returns nothing when there is no CV: absence of a document is not evidence.
 */
export function cvChecksFor(input: CrossCheckInput): CvCheck[] {
  const extraction = tidy(input);
  if (!extraction) return [];

  const quantified = extraction.quantifiedAchievements?.length ?? 0;
  const unquantified = extraction.unquantifiedClaims?.length ?? 0;
  const atsIssues = extraction.atsIssues ?? [];
  const ai = aiMentions(extraction);

  const checks: CvCheck[] = [];

  // o1: duties or results. The ladder runs "duties only" to "every claim has
  // a number", so count the lines that carry a figure against those that
  // don't.
  {
    let cvScore: number;
    if (quantified === 0) cvScore = unquantified > 0 ? 2 : 1;
    else if (quantified <= 2) cvScore = 3;
    else if (quantified <= 4) cvScore = quantified > unquantified ? 4 : 3;
    else cvScore = unquantified === 0 ? 5 : 4;

    const evidence =
      quantified === 0
        ? unquantified > 0
          ? `Your CV makes ${plural(unquantified, "claim")} about value but none of them carries a number.`
          : "Your CV lists responsibilities. We could not find a single line that states a result."
        : `Your CV has ${plural(quantified, "line")} with a number attached and ${plural(unquantified, "claim")} without one.`;
    checks.push({ questionId: "o1", dimension: "Offer", cvScore: clamp(cvScore), evidence });
  }

  // p2: a measurable result. Level 5 needs a baseline and an after, which a
  // CV rarely shows and we cannot verify, so the reading tops out at 4.
  {
    let cvScore: number;
    if (quantified === 0) cvScore = unquantified > 0 ? 2 : 1;
    else if (quantified <= 2) cvScore = 3;
    else cvScore = 4;

    const sample = (extraction.quantifiedAchievements ?? []).slice(0, 2).map((a) => `"${a.value}"`);
    const evidence =
      quantified === 0
        ? "Your CV states no measured result. Not one before-and-after, not one percentage, not one count."
        : `Your CV already carries ${plural(quantified, "measured result")}, for example ${sample.join(" and ")}.`;
    checks.push({ questionId: "p2", dimension: "Proof", cvScore: clamp(cvScore), evidence });
  }

  // sm1: surviving screening. The extraction lists concrete problems that
  // would cost them an automated filter or a six second scan.
  {
    const n = atsIssues.length;
    const cvScore = n >= 4 ? 2 : n >= 2 ? 3 : 4;
    const evidence =
      n === 0
        ? "We found nothing in your CV that would obviously trip automated screening."
        : `Your CV has ${plural(n, "screening problem")}: ${atsIssues.slice(0, 3).join("; ")}${n > 3 ? "; and more" : ""}.`;
    checks.push({ questionId: "sm1", dimension: "Search Mechanics", cvScore, evidence });
  }

  // a1: AI in their work. A CV that mentions it evidences at least regular
  // use; one that never mentions it reads as occasional at best. Depth
  // beyond that cannot be read off a document, so the reading sits at 3.
  {
    const cvScore = ai.length > 0 ? 3 : 2;
    const evidence =
      ai.length > 0
        ? `Your CV mentions AI or automation work: ${ai.slice(0, 3).join(", ")}${ai.length > 3 ? ", and more" : ""}.`
        : "Your CV never mentions AI, an assistant, or anything you automated.";
    checks.push({ questionId: "a1", dimension: "AI Fluency", cvScore, evidence });
  }

  return checks;
}

function adviceFor(check: CvCheck, direction: Discrepancy["direction"], extraction: ResumeExtraction): string {
  const quantified = extraction.quantifiedAchievements?.length ?? 0;
  const ai = aiMentions(extraction);
  const issues = extraction.atsIssues ?? [];

  switch (check.questionId) {
    case "o1":
      return direction === "cv-lower"
        ? "On paper you read as duties, whatever you can do in the room. The rewritten lines below are the fix: each turns a responsibility into a result, with a placeholder for the figure only you can supply."
        : `You are underselling yourself. Your CV already carries ${plural(quantified, "quantified result")}. Lead with them in your thirty-second answer.`;
    case "p2":
      return direction === "cv-lower"
        ? `You said you can name measurable results, and the CV shows ${quantified === 0 ? "none" : `only ${quantified}`}. Get the numbers in your head onto the page, one per role, before the next application.`
        : `Your CV already carries ${plural(quantified, "measured result")}. You have more proof than you rated yourself for. Practise saying them out loud.`;
    case "sm1":
      return direction === "cv-lower"
        ? `You said the CV is tailored, but it carries ${plural(issues.length, "problem")} that screening will catch${issues[0] ? `, starting with: ${issues[0]}` : ""}. Fix those before you send it again.`
        : "Your CV is in better shape for screening than you gave it credit for. Tailor it to each advert's wording and you are at level four.";
    case "a1":
      return direction === "cv-lower"
        ? "Whatever you do with AI, the CV never says so, and employers screen for it by keyword. Add the tool, the task it changed and the result, in one line per role."
        : `Your CV already mentions ${ai.slice(0, 2).join(" and ")}. You are more fluent than you rated yourself, so say so.`;
    default:
      return "";
  }
}

/**
 * Compares the CV reading with the answers given. Only gaps of at least
 * DISCREPANCY_THRESHOLD rungs are returned; a one-rung difference is noise.
 */
export function reconcile(
  input: CrossCheckInput,
  answers: Record<string, number> | null | undefined
): Discrepancy[] {
  const extraction = tidy(input);
  if (!extraction || !answers) return [];
  const out: Discrepancy[] = [];
  for (const check of cvChecksFor(extraction)) {
    const self = answers[check.questionId];
    if (typeof self !== "number" || !Number.isFinite(self)) continue;
    const diff = self - check.cvScore;
    if (Math.abs(diff) < DISCREPANCY_THRESHOLD) continue;
    const direction: Discrepancy["direction"] = diff > 0 ? "cv-lower" : "cv-higher";
    out.push({
      ...check,
      questionText: questionFor(check.questionId)?.questionText ?? check.questionId,
      selfScore: self,
      selfLabel: optionLabel(check.questionId, self),
      cvLabel: optionLabel(check.questionId, check.cvScore),
      direction,
      advice: adviceFor(check, direction, extraction),
    });
  }
  return out;
}

/** One line per gap, for lead notes, the alert email and the report prompt. */
export function formatDiscrepancyLines(discrepancies: Discrepancy[]): string[] {
  return discrepancies.map(
    (d) =>
      `${d.dimension} (${d.questionId}): rated themselves "${d.selfLabel}" (${d.selfScore}/5); CV reads "${d.cvLabel}" (${d.cvScore}/5). ${d.evidence}`
  );
}

/**
 * The sentence that ties the CV rewrites back to the Offer question, so the
 * reformat reads as the answer to something they just told us rather than
 * generic advice. Null when they did not answer o1.
 */
export function rewriteLinkLine(answers: Record<string, number> | null | undefined): string | null {
  const self = answers?.o1;
  if (typeof self !== "number") return null;
  if (self >= 5) {
    return "You rated every claim on your CV as evidenced. These rewrites are what that standard looks like on the page.";
  }
  return `You rated your CV "${optionLabel("o1", self)}" on the Offer question. These rewrites move each line toward "Results with evidence".`;
}
