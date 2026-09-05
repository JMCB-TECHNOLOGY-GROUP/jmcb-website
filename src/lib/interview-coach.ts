// ============================================================
// src/lib/interview-coach.ts — the Interview Coach.
//
// A mock interviewer that interviews someone from THEIR OWN CV and their
// Career Compass results, not from a generic question bank. The persona is
// the hiring manager for the role they are going for. It presses for figures
// where the CV has none, opens the gaps the CV shows, and scores every answer
// on a fixed rubric.
//
// Two rules carried over from lib/resume.ts:
//   1. Everything that CAN be deterministic IS. The question plan, the answer
//      signals, the averages and the overall score are computed here, so the
//      session runs and scores even when generation is unavailable.
//   2. The model never states a fact about the candidate that is not in the
//      CV or in their own answers. A suggested better answer that introduces
//      a figure the candidate never gave is dropped, not softened.
//
// Consumed by /interview-coach, /api/interview-coach/turn and
// /api/interview-coach/debrief. Sold to coaches and HR teams as well as used
// by individuals, so the debrief carries a coach-facing block.
// ============================================================

import { figuresAreGrounded, numbersIn, flattenSkills, type ResumeExtraction } from "./resume";
import { reconcile, type CrossCheckInput, type Discrepancy } from "./career-crosscheck";

export const COACH_NAME = "Interview Coach";

/** sessionStorage key Career Compass uses to hand its CV and answers to the coach. */
export const HANDOFF_KEY = "interviewCoachHandoff";

export type CoachHandoff = {
  targetTitle?: string;
  targetField?: string;
  firstName?: string;
  extraction?: ResumeExtraction | null;
  cvText?: string;
  answers?: Record<string, number>;
};

/** Six questions is a twenty-minute session, which is what people finish. */
export const MAX_QUESTIONS = 6;

export type QuestionKind = "opener" | "claim" | "figure" | "gap" | "discrepancy" | "generic" | "closer";

export type CoachQuestion = {
  id: string;
  kind: QuestionKind;
  text: string;
  /** Why this question is being asked of THIS person. Shown after they answer. */
  why: string;
  /** What a strong answer contains. Fed to the scorer, shown in the debrief. */
  lookingFor: string;
};

export type CoachSession = {
  targetTitle: string;
  targetField?: string;
  firstName?: string;
  persona: string;
  /** Plain-text facts the interviewer may rely on. Nothing else about the candidate exists. */
  cvFacts: string;
  /** The CV's own text, for grounding suggested answers. Optional. */
  cvText?: string;
  questions: CoachQuestion[];
};

export type AnswerScore = {
  structure: number;
  evidence: number;
  relevance: number;
  concision: number;
  note: string;
  betterAnswer?: string;
};

export const RUBRIC: { key: keyof Omit<AnswerScore, "note" | "betterAnswer">; label: string; blurb: string }[] = [
  { key: "structure", label: "Structure", blurb: "Situation, what you did, what happened. In that order, and you got to the point." },
  { key: "evidence", label: "Evidence", blurb: "A specific example with a figure, not a description of your approach." },
  { key: "relevance", label: "Relevance", blurb: "It answered the question asked, for the role you are going for." },
  { key: "concision", label: "Concision", blurb: "Long enough to prove it, short enough that they were still listening." },
];

export type Turn = {
  questionId: string;
  question: string;
  answer: string;
  score: AnswerScore;
  followUp?: string;
  followUpAnswer?: string;
};

// ── persona ─────────────────────────────────────────────────

export function buildPersona(targetTitle: string, industries: string[] = []): string {
  const sector = industries.length ? ` The company works in ${industries.slice(0, 2).join(" and ")}.` : "";
  return `You are the hiring manager interviewing candidates for the role of ${targetTitle}.${sector} You are direct, fair and warm, but not soft. You listen for specifics: what the candidate personally did, what changed because of it, and the number that proves it. When an answer describes an approach instead of an example, you say so. When it has no figure, you ask for one. You never flatter, you never lecture, and you never state anything about the candidate that is not in the CV facts you were given or in what they have said in this interview. You write like a person, in short sentences, with no em dashes or en dashes.`;
}

// ── question plan ───────────────────────────────────────────

type PlanInput = {
  targetTitle: string;
  extraction?: CrossCheckInput & {
    currentTitle?: string | null;
    industries?: string[] | null;
    missingForTarget?: (string | null)[] | null;
  };
  answers?: Record<string, number> | null;
};

const q = (id: string, kind: QuestionKind, text: string, why: string, lookingFor: string): CoachQuestion => ({
  id,
  kind,
  text,
  why,
  lookingFor,
});

/**
 * Deterministic. Opener and closer are fixed; the middle is built from the
 * CV's own weak points and the Career Compass gaps, in priority order, capped
 * at MAX_QUESTIONS. With no CV the middle falls back to three questions that
 * still force evidence.
 */
export function buildQuestionPlan(input: PlanInput): CoachQuestion[] {
  const title = input.targetTitle.trim() || "this role";
  const ex = input.extraction ?? null;
  const unquantified = (ex?.unquantifiedClaims ?? []).map((c) => c?.value?.trim()).filter((v): v is string => Boolean(v));
  const quantified = (ex?.quantifiedAchievements ?? []).map((c) => c?.value?.trim()).filter((v): v is string => Boolean(v));
  const missing = (ex?.missingForTarget ?? []).filter((m): m is string => typeof m === "string" && m.trim() !== "");
  const discrepancies: Discrepancy[] = ex ? reconcile(ex, input.answers) : [];

  const plan: CoachQuestion[] = [
    q(
      "opener",
      "opener",
      `Tell me about yourself, and why ${title}.`,
      "This is the thirty-second answer everything else hangs on. Clarity c2 on the Compass measures exactly this.",
      "Who you are in one line, the two things you have done that matter for this role, and why this role now. Under sixty seconds."
    ),
  ];

  const middle: CoachQuestion[] = [];

  for (const claim of unquantified.slice(0, 2)) {
    middle.push(
      q(
        `claim-${middle.length + 1}`,
        "claim",
        `Your CV says "${claim}". Walk me through what you actually did there, and what changed as a result. I would like a number.`,
        "This line on your CV claims value but carries no figure. Interviewers pick these on purpose.",
        "One specific example, your own actions, and a before-and-after with a figure, even an estimate."
      )
    );
  }

  if (quantified[0]) {
    middle.push(
      q(
        "figure",
        "figure",
        `Your CV says "${quantified[0]}". How was that measured, and what was it before you started?`,
        "A number on a CV invites this question every time. If you cannot show the working, the number costs you credibility instead of earning it.",
        "The baseline, how you measured it, what you did, and the result. Ownership of the figure."
      )
    );
  }

  const aiGap = discrepancies.find((d) => d.questionId === "a1" && d.direction === "cv-lower");
  const offerGap = discrepancies.find((d) => d.questionId === "o1" && d.direction === "cv-lower");
  const proofGap = discrepancies.find((d) => d.questionId === "p2" && d.direction === "cv-lower");

  if (aiGap) {
    middle.push(
      q(
        "discrepancy-ai",
        "discrepancy",
        "Tell me about a piece of your work you changed with AI. What did it look like before, and after?",
        `You rated your AI use "${aiGap.selfLabel}" but your CV never mentions it. An interviewer will find that gap in one question.`,
        "The task, the tool, what you had to check, and what it saved or improved. Where it failed is a plus."
      )
    );
  } else if (offerGap || proofGap) {
    middle.push(
      q(
        "discrepancy-results",
        "discrepancy",
        "Pick one responsibility on your CV and tell me the result it produced.",
        `You rated yourself "${(offerGap ?? proofGap)!.selfLabel}" on results, but the CV reads as duties. This is the question that tests it.`,
        "A duty turned into an outcome, with a figure and who noticed."
      )
    );
  }

  if (missing[0]) {
    middle.push(
      q(
        "gap",
        "gap",
        `A ${title} here would need ${missing[0].trim().replace(/\.$/, "")}. Where is the closest thing you have done?`,
        "Your CV does not show this, and the role expects it. Better to have an answer ready than to be surprised.",
        "The nearest real experience, honestly framed, and how you would close the rest of the gap."
      )
    );
  }

  if (middle.length === 0) {
    middle.push(
      q("generic-1", "generic", "Tell me about a time you improved something at work. What was the number?", "Without a CV to work from, this is the question every interviewer asks in some form.", "One example, your actions, a measured result."),
      q("generic-2", "generic", `What does a ${title} have to get right in the first ninety days?`, "Tests whether you have thought about the job rather than the title.", "Two or three concrete priorities and how you would know they were done."),
      q("generic-3", "generic", "Tell me about a task you changed with AI, and where it got things wrong.", "Employers now ask what you have done with AI, not whether you have heard of it.", "The task, the tool, the check you had to add, and the saving.")
    );
  }

  plan.push(...middle.slice(0, MAX_QUESTIONS - 2));

  plan.push(
    q(
      "closer",
      "closer",
      "What would you need to know from us before you could say yes to an offer?",
      "Candidates who ask nothing signal they would take anything. Offer o2 on the Compass measures whether you know what the role pays.",
      "Two or three real questions: the range, the first project, who you would report to. Not 'no, I think you covered it'."
    )
  );

  return plan;
}

/** The interviewer's only knowledge of the candidate, as plain text. */
export function buildCvFacts(extraction: PlanInput["extraction"] | null | undefined): string {
  if (!extraction) return "No CV was provided. You know nothing about the candidate beyond what they tell you.";
  const skills = flattenSkills(extraction as Parameters<typeof flattenSkills>[0]);
  const lines = [
    extraction.currentTitle ? `Current title: ${extraction.currentTitle}` : null,
    extraction.industries?.length ? `Industries: ${extraction.industries.join(", ")}` : null,
    skills.length ? `Skills on the CV: ${skills.join(", ")}` : null,
    extraction.quantifiedAchievements?.length
      ? `Achievements with a number: ${extraction.quantifiedAchievements.map((a) => a?.value).filter(Boolean).join(" | ")}`
      : "Achievements with a number: none",
    extraction.unquantifiedClaims?.length
      ? `Claims with no figure: ${extraction.unquantifiedClaims.map((a) => a?.value).filter(Boolean).join(" | ")}`
      : null,
    extraction.missingForTarget?.length ? `Missing for the target role: ${extraction.missingForTarget.filter(Boolean).join(", ")}` : null,
  ].filter((l): l is string => Boolean(l));
  return lines.join("\n");
}

// ── answer signals (deterministic) ──────────────────────────

const OUTCOME_VERBS =
  /\b(reduc|cut|sav|increas|grew|grow|improv|deliver|launch|shipp|built|automat|clos|won|rais|achiev|complet|migrat|recover|fix)\w*/i;

export type AnswerSignals = {
  words: number;
  hasFigure: boolean;
  hasOutcomeVerb: boolean;
  /** Share of first-person singular among I/we mentions. 1 = all "I". */
  ownership: number;
};

export function answerSignals(answer: string): AnswerSignals {
  const text = String(answer ?? "").trim();
  const words = text ? text.split(/\s+/).length : 0;
  const i = (text.match(/\b(I|I'm|I've|I'd|my|me)\b/g) ?? []).length;
  // "I" is always capitalised; "We" starts sentences, so match it either way.
  const we = (text.match(/\b(we|we're|we've|our|us)\b/gi) ?? []).length;
  return {
    words,
    // Spoken answers carry numbers as words ("six people", "day ten"), and
    // those are figures too. Digits, fractions and number words all count.
    hasFigure:
      numbersIn(text).length > 0 ||
      /\b(half|double|third|quarter|twice|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million)\b/i.test(text),
    hasOutcomeVerb: OUTCOME_VERBS.test(text),
    ownership: i + we === 0 ? 0 : i / (i + we),
  };
}

/**
 * The score the session falls back to when generation is unavailable, and
 * the floor the model's evidence score is clamped to. An answer with no
 * figure cannot score above 2 on evidence, whatever the model says.
 */
export function heuristicScore(answer: string, signals = answerSignals(answer)): AnswerScore {
  const evidence = signals.hasFigure ? (signals.hasOutcomeVerb ? 4 : 3) : signals.hasOutcomeVerb ? 2 : 1;
  const concision = signals.words === 0 ? 1 : signals.words < 25 ? 2 : signals.words <= 180 ? 4 : signals.words <= 260 ? 3 : 2;
  const structure = signals.words < 25 ? 1 : signals.hasOutcomeVerb ? 3 : 2;
  const relevance = signals.words < 25 ? 1 : 3;
  const note =
    signals.words < 25
      ? "That was too short to score. Give an example."
      : !signals.hasFigure
        ? "No figure. An interviewer hears that as a claim, not a result."
        : signals.ownership < 0.5
          ? "Mostly 'we'. Say what you personally did."
          : "Clear example with a number. Keep it that tight.";
  return { structure, evidence, relevance, concision, note };
}

const clamp15 = (v: unknown, fallback: number) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(5, Math.max(1, n)) : fallback;
};

/**
 * Coerces the model's score to the rubric and applies the deterministic
 * floors and ceilings. The heuristic is the fallback for any missing field.
 */
export function normalizeScore(raw: unknown, answer: string): AnswerScore {
  const h = heuristicScore(answer);
  const o = (raw ?? {}) as Record<string, unknown>;
  const evidence = clamp15(o.evidence, h.evidence);
  const signals = answerSignals(answer);
  return {
    structure: clamp15(o.structure, h.structure),
    // No figure, no evidence above 2. The model does not get to be generous here.
    evidence: signals.hasFigure ? evidence : Math.min(evidence, 2),
    relevance: clamp15(o.relevance, h.relevance),
    concision: clamp15(o.concision, h.concision),
    note: typeof o.note === "string" && o.note.trim() ? o.note.trim() : h.note,
    betterAnswer: typeof o.betterAnswer === "string" && o.betterAnswer.trim() ? o.betterAnswer.trim() : undefined,
  };
}

/**
 * A suggested answer may only carry figures the candidate gave or the CV
 * contains. Anything else is invention and is dropped.
 */
export function groundBetterAnswer(
  better: string | undefined,
  answer: string,
  cvText?: string,
  cvFacts?: string
): string | undefined {
  if (!better) return undefined;
  return figuresAreGrounded(better, answer, cvText ?? "", cvFacts ?? "") ? better : undefined;
}

// ── debrief (deterministic) ─────────────────────────────────

export type Debrief = {
  overall: number;
  averages: Record<(typeof RUBRIC)[number]["key"], number>;
  strongest: (typeof RUBRIC)[number]["key"];
  weakest: (typeof RUBRIC)[number]["key"];
  band: { label: string; summary: string };
};

export function debriefFrom(turns: Turn[]): Debrief {
  const keys = RUBRIC.map((r) => r.key);
  const averages = {} as Debrief["averages"];
  for (const k of keys) {
    const vals = turns.map((t) => t.score?.[k]).filter((v): v is number => typeof v === "number");
    averages[k] = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : 0;
  }
  const mean = keys.reduce((a, k) => a + averages[k], 0) / keys.length;
  const overall = turns.length ? Math.round(((mean - 1) / 4) * 100) : 0;
  const sorted = [...keys].sort((a, b) => averages[b] - averages[a]);
  const band =
    overall >= 80
      ? { label: "Ready", summary: "You would hold your own in this interview today. The work now is polish and pacing." }
      : overall >= 60
        ? { label: "Close", summary: "The substance is there. One habit is costing you, and it is fixable in a week of practice." }
        : overall >= 40
          ? { label: "Building", summary: "You have the experience but it is not coming out as evidence. That is the most common place to be." }
          : { label: "Not yet", summary: "Answers are describing your approach rather than proving your results. Better to know now." };
  return { overall, averages, strongest: sorted[0], weakest: sorted[sorted.length - 1], band };
}

// ── prompts ─────────────────────────────────────────────────

function transcriptText(turns: Turn[]): string {
  return turns
    .map(
      (t, i) =>
        `Q${i + 1}: ${t.question}\nA${i + 1}: ${t.answer}${t.followUp ? `\nFollow-up: ${t.followUp}\nA: ${t.followUpAnswer ?? "(not answered)"}` : ""}`
    )
    .join("\n\n");
}

export function buildTurnPrompt(
  session: CoachSession,
  turns: Turn[],
  question: CoachQuestion,
  answer: string,
  signals: AnswerSignals,
  allowFollowUp: boolean
): string {
  return `${session.persona}

CV FACTS (the only things you know about the candidate beyond this interview):
${session.cvFacts}

INTERVIEW SO FAR:
${transcriptText(turns) || "(this is the first question)"}

YOU JUST ASKED: ${question.text}
Why you asked it: ${question.why}
A strong answer contains: ${question.lookingFor}

THE CANDIDATE ANSWERED:
${answer}

Signals already measured: ${signals.words} words; ${signals.hasFigure ? "contains a figure" : "NO figure"}; ${signals.hasOutcomeVerb ? "names an outcome" : "no outcome named"}; ownership ${Math.round(signals.ownership * 100)}% first person.

Score the answer 1 to 5 on each of: structure (situation, action, result, in order), evidence (a specific example with a figure), relevance (answered THIS question for THIS role), concision. Then write:
- note: two sentences, spoken as the interviewer, on what worked and the one thing to fix. Direct. No praise padding.
- betterAnswer: the candidate's own answer rewritten the way a strong candidate would say it, in first person, under 120 words. Use ONLY facts from their answer and the CV facts. Where a figure is needed that they did not give, write [X]. Never invent a number, a company, or an outcome.
${allowFollowUp ? "- followUp: ONE short follow-up question, only if the answer left the key thing unproven (no figure, no personal action, or dodged the question). Otherwise an empty string." : "- followUp: empty string."}

Rules: no em dashes or en dashes. Contractions are fine. Respond ONLY with JSON in exactly this shape:
{"structure":3,"evidence":3,"relevance":3,"concision":3,"note":"...","betterAnswer":"...","followUp":""}`;
}

export function buildDebriefPrompt(session: CoachSession, turns: Turn[], debrief: Debrief): string {
  const weakestLabel = RUBRIC.find((r) => r.key === debrief.weakest)?.label ?? debrief.weakest;
  return `${session.persona}

The interview is over. You are now writing the debrief for ${session.firstName || "the candidate"}, who is going for ${session.targetTitle}.

CV FACTS:
${session.cvFacts}

FULL TRANSCRIPT WITH SCORES:
${turns
  .map(
    (t, i) =>
      `Q${i + 1}: ${t.question}\nA${i + 1}: ${t.answer}\nScores: structure ${t.score.structure}, evidence ${t.score.evidence}, relevance ${t.score.relevance}, concision ${t.score.concision}`
  )
  .join("\n\n")}

Computed: overall ${debrief.overall}/100 (${debrief.band.label}). Strongest: ${debrief.strongest}. Weakest: ${weakestLabel}.

Write four things.
1. summary: three short paragraphs, spoken as the interviewer, on how this went and whether you would advance them. Honest. Name the one habit that cost them most (it is ${weakestLabel}) and the one thing they did well.
2. fixes: exactly three specific things to do before the real interview, each one sentence, each tied to something they actually said.
3. rewrittenAnswers: the two weakest answers rewritten in first person the way a strong candidate would say them, as [{"questionId":"...","answer":"..."}]. Use ONLY facts from their answers and the CV facts. Write [X] where a figure is needed that they did not give. Never invent a number, a company, or an outcome.
4. coachNotes: one paragraph written for a careers coach or HR partner who was not in the room: what this candidate needs, what they should practise, and what an employer would see. Plain and useful.

Rules: no em dashes or en dashes. No jargon, no "journey", no "leverage". Respond ONLY with JSON in exactly this shape:
{"summary":"...","fixes":["...","...","..."],"rewrittenAnswers":[{"questionId":"...","answer":"..."}],"coachNotes":"..."}`;
}
