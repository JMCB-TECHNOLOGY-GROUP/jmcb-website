// ============================================================
// src/lib/skill-plan.ts — turns a weak area into a plan.
//
// Both the Interview Coach debrief and the Career Compass results can name
// what is weak. Neither said what to DO about it. This module does, and it
// does it deterministically, so a candidate always leaves with the same
// shape of plan whether or not generation was available:
//
//   weak area -> their own weak example -> the strong version
//             -> the concrete skill -> a named course -> a timed drill
//             -> how they will know it is fixed
//
// The catalogue is real, named courses with real prices. Free ones first.
// The "before" is always the candidate's own words; the "after" is the
// grounded rewrite the model produced (or the programme's own template when
// no rewrite survived), so the example is theirs, not a stock one.
//
// Consumed by /api/interview-coach/debrief, /interview-coach and
// /career-assessment.
// ============================================================

import type { CompassDimension } from "./career-assessment";
import { PROGRAM_NAME } from "./program";

export type Course = {
  name: string;
  provider: string;
  url: string;
  /** "Free" or a price. Shown as written. */
  cost: string;
  hours: string;
};

export type PlanEntry = {
  /** Machine key: rubric key, compass dimension, or a target-gap keyword. */
  key: string;
  area: string;
  why: string;
  /** The candidate's own weak example, verbatim. */
  before?: string;
  /** The strong version, grounded in their facts. */
  after?: string;
  skills: string[];
  courses: Course[];
  drill: string;
  measure: string;
};

// ── course catalogue ────────────────────────────────────────

export const COURSES = {
  interviewingUMD: {
    name: "Successful Interviewing",
    provider: "University of Maryland on Coursera",
    url: "https://www.coursera.org/learn/interviewing",
    cost: "Free to audit",
    hours: "8 hours",
  },
  aiFluency: {
    name: "AI Fluency: Framework and Foundations",
    provider: "Anthropic Academy",
    url: "https://anthropic.skilljar.com/",
    cost: "Free",
    hours: "3 to 4 hours",
  },
  claude101: {
    name: "Claude 101",
    provider: "Anthropic Academy",
    url: "https://anthropic.skilljar.com/",
    cost: "Free",
    hours: "1 hour",
  },
  claudeApi: {
    name: "Building with the Claude API",
    provider: "Anthropic Academy",
    url: "https://anthropic.skilljar.com/",
    cost: "Free",
    hours: "6 to 8 hours",
  },
  claudeCode: {
    name: "Claude Code in Action",
    provider: "Anthropic Academy",
    url: "https://anthropic.skilljar.com/",
    cost: "Free",
    hours: "2 to 3 hours",
  },
  architectCert: {
    name: "Claude Certified Architect, Foundations",
    provider: "Anthropic Partner Academy",
    url: "https://www.anthropic.com/partners",
    cost: "$125 exam",
    hours: "10 evenings of study",
  },
  promptingEssentials: {
    name: "Google Prompting Essentials",
    provider: "Google on Coursera",
    url: "https://www.coursera.org/learn/google-prompting-essentials",
    cost: "Free to audit",
    hours: "9 hours",
  },
  dlaiShortCourses: {
    name: "Short courses on LLM applications, RAG and agents",
    provider: "DeepLearning.AI",
    url: "https://www.deeplearning.ai/short-courses/",
    cost: "Free",
    hours: "1 to 2 hours each",
  },
  azureAiFundamentals: {
    name: "Azure AI Fundamentals (AI-900) learning path",
    provider: "Microsoft Learn",
    url: "https://learn.microsoft.com/credentials/certifications/azure-ai-fundamentals/",
    cost: "Free path, $99 exam",
    hours: "10 to 12 hours",
  },
  pythonFcc: {
    name: "Scientific Computing with Python",
    provider: "freeCodeCamp",
    url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
    cost: "Free",
    hours: "About 30 hours",
  },
  proofOfWork: {
    name: `${PROGRAM_NAME}: eight weeks, eight shipped projects`,
    provider: "JMCB Technology Group",
    url: "/program",
    cost: "Free, application gated",
    hours: "90 minutes a week plus build time",
  },
} satisfies Record<string, Course>;

// ── rubric plans (Interview Coach) ──────────────────────────

const RUBRIC_PLANS: Record<string, Omit<PlanEntry, "before" | "after">> = {
  evidence: {
    key: "evidence",
    area: "Evidence",
    why: "Your answers describe what you did without a figure that proves it worked. Interviewers hear that as a claim, and claims do not get remembered after the panel.",
    skills: [
      "Quantifying an outcome: baseline, what you changed, the number after",
      "Owning a figure: how it was measured and by whom",
      "Turning a duty into a result in one sentence",
    ],
    courses: [COURSES.interviewingUMD, COURSES.proofOfWork],
    drill: "Take your three most recent responsibilities. For each, write the line as a result with a number, even an estimate you can defend. Ten minutes a day for five days. Say each one out loud, once, to another person.",
    measure: "In your next session every answer carries at least one figure, and Evidence averages 4 or higher.",
  },
  structure: {
    key: "structure",
    area: "Structure",
    why: "Your answers wander before they land. The panel needs the situation, what you did, and what happened, in that order, or they stop listening before the good part.",
    skills: [
      "STAR in under ninety seconds: situation, task, action, result",
      "Leading with the result, then backfilling the story",
      "Ending on the number, not on the timeline",
    ],
    courses: [COURSES.interviewingUMD],
    drill: "Record yourself answering one question a day for a week, on your phone, ninety seconds maximum. Play it back and mark where the result appears. Move it earlier each time.",
    measure: "Structure averages 4 or higher and your answers get shorter, not longer.",
  },
  relevance: {
    key: "relevance",
    area: "Relevance",
    why: "You answered a question near the one that was asked, or for a role near the one you want. Panels notice, and they read it as not having thought about their job.",
    skills: [
      "Restating the question in one line before answering it",
      "Mapping each story to a requirement in the advert",
      "Dropping detail the role does not need",
    ],
    courses: [COURSES.interviewingUMD],
    drill: "Print one job advert for your target role. For each requirement, write the story you would tell and the figure in it. Practise the three the advert lists first.",
    measure: "Relevance averages 4 or higher, and you can name which requirement each answer serves.",
  },
  concision: {
    key: "concision",
    area: "Concision",
    why: "Either too short to prove anything or so long the panel lost the point. Long enough to prove it, short enough that they were still listening.",
    skills: [
      "Answering in three sentences: what, how, result",
      "Cutting the preamble",
      "Stopping when the result has been said",
    ],
    courses: [COURSES.interviewingUMD],
    drill: "Write your weakest answer out. Cut it to a hundred words without losing the number. Then to sixty. Read the sixty-word version aloud until it sounds natural.",
    measure: "Answers land between 60 and 150 words, and Concision averages 4 or higher.",
  },
};

// ── dimension plans (Career Compass) ────────────────────────

const DIMENSION_PLANS: Record<CompassDimension, Omit<PlanEntry, "before" | "after">> = {
  Clarity: {
    key: "Clarity",
    area: "Clarity",
    why: "You cannot yet name the role, or say in thirty seconds why you fit it. Everything downstream, the CV, the applications, the interviews, inherits that vagueness.",
    skills: ["Naming one target title and three companies hiring for it", "A thirty-second pitch that names the role and your two proofs"],
    courses: [COURSES.interviewingUMD, COURSES.proofOfWork],
    drill: "Write the title. Find three live adverts for it. Write one paragraph on why you fit each, using their words. Say the paragraph aloud daily for a week.",
    measure: "You can give the pitch without notes and it names a title, not a field.",
  },
  Offer: {
    key: "Offer",
    area: "Offer",
    why: "Your CV and your answers list duties. Employers buy outcomes, and they pay for them at a rate you have not yet looked up.",
    skills: ["Rewriting a duty as a result with a figure", "Knowing the pay range for the target title in your market"],
    courses: [COURSES.interviewingUMD, COURSES.proofOfWork],
    drill: "Rewrite every bullet on your CV that starts with 'responsible for' as a result. Then look up the pay range on three sources and write down where you sit in it.",
    measure: "Every CV bullet names an outcome, most with a number, and you can state the range.",
  },
  Momentum: {
    key: "Momentum",
    area: "Momentum",
    why: "The search happens in bursts, and nothing is tracked, so you cannot tell what is working.",
    skills: ["Two fixed search blocks a week", "A five-column tracker: company, role, date, status, next action"],
    courses: [COURSES.proofOfWork],
    drill: "Book two ninety-minute blocks in your calendar for the next four weeks. Build the tracker today and backfill the last month.",
    measure: "Four weeks of blocks kept, and a response rate you can quote.",
  },
  Proof: {
    key: "Proof",
    area: "Proof",
    why: "You can describe your work but cannot show it. Candidates who can show it stop competing on credentials.",
    skills: ["Publishing one piece of real work with its result", "Measuring before and after on something you do this month"],
    courses: [COURSES.proofOfWork, COURSES.claudeCode],
    drill: "Pick one thing you do at work. Measure it this week. Change it. Measure it again. Write it up in a page with the two numbers, and put it somewhere linkable.",
    measure: "One link you would send an employer, showing a before-and-after.",
  },
  "AI Fluency": {
    key: "AI Fluency",
    area: "AI Fluency",
    why: "Employers now ask what you have done with AI, not whether you have heard of it. The gap between the two is where the jobs are.",
    skills: ["Using AI on a real task and knowing where it fails", "Writing down the check a human must still do"],
    courses: [COURSES.aiFluency, COURSES.claude101, COURSES.promptingEssentials, COURSES.proofOfWork],
    drill: "Take one weekly task. Do it with AI for a week. Keep a note of every place it got something wrong and what you had to check. That note is your interview answer.",
    measure: "You can name the task, the tool, the saving, and the failure mode, in under a minute.",
  },
  Signal: {
    key: "Signal",
    area: "Signal",
    why: "The right people cannot find you, and nobody is vouching for you, so you are competing in the most crowded part of the market.",
    skills: ["A profile headline that names the target title", "Five real conversations a month with people who know your work"],
    courses: [COURSES.proofOfWork],
    drill: "Rewrite your profile headline to the target title today. Message five people who have seen your work, one a day, asking for a conversation rather than a job.",
    measure: "One relevant approach in the next thirty days without you applying.",
  },
  "Search Mechanics": {
    key: "Search Mechanics",
    area: "Search Mechanics",
    why: "Your CV is not passing automated screening, or your interviews are not converting. The fix for each is different, and the assessment tells you which you have.",
    skills: ["Tailoring the CV to the advert's exact wording", "Passing a six-second human scan: headline, contact, results at the top"],
    courses: [COURSES.interviewingUMD, COURSES.proofOfWork],
    drill: "Take one advert. Rewrite your CV against its wording. Compare the two side by side and note what you had been leaving out.",
    measure: "A tailored CV per application and a response rate you track.",
  },
};

// ── target-gap plans (what the role expects that the CV lacks) ──

type GapRule = { match: RegExp; entry: Omit<PlanEntry, "before" | "after" | "why"> };

const GAP_RULES: GapRule[] = [
  {
    match: /\b(llm|generative|gen ai|prompt|rag|retrieval|agent|claude|gpt|langchain|vector)\b/i,
    entry: {
      key: "gap-llm",
      area: "Hands-on LLM delivery",
      skills: ["Building one working assistant or automation on a model API", "Retrieval over your own documents", "Writing the evaluation that shows where it fails"],
      courses: [COURSES.claudeApi, COURSES.dlaiShortCourses, COURSES.architectCert, COURSES.proofOfWork],
      drill: "Build one small thing that runs without you: a document Q&A over your own files, or an automation that drafts something you write weekly. Ship it, write down what it gets wrong, and put the link on your CV.",
      measure: "One shipped artefact with a link, a figure, and a named failure mode, on the CV within thirty days.",
    },
  },
  {
    match: /\b(machine learning|ml ops|mlops|data science|tensorflow|pytorch|databricks|azure ml|sagemaker|model training)\b/i,
    entry: {
      key: "gap-ml",
      area: "Machine learning and MLOps evidence",
      skills: ["The vocabulary: training, evaluation, drift, deployment", "One end-to-end example you can talk through", "Knowing which problems do not need ML at all"],
      courses: [COURSES.azureAiFundamentals, COURSES.dlaiShortCourses, COURSES.pythonFcc],
      drill: "Complete the AI-900 learning path and sit the exam. Then write one page on a problem from your own work, whether it needs ML, and what you would measure.",
      measure: "A credential on the CV and one written example you can defend.",
    },
  },
  {
    match: /\b(python|coding|programming|scripting|software development|sql)\b/i,
    entry: {
      key: "gap-code",
      area: "Coding evidence",
      skills: ["Enough Python to read and adapt an example", "Automating one thing you do by hand", "Version control basics"],
      courses: [COURSES.pythonFcc, COURSES.claudeCode, COURSES.proofOfWork],
      drill: "Automate one manual task with a script this month, with AI assistance. Put it in a public repository with a README that says what it saved.",
      measure: "One repository link on the CV with a saving in the README.",
    },
  },
  {
    match: /\b(certif|aws|azure|gcp|cloud)\b/i,
    entry: {
      key: "gap-cert",
      area: "Credentials the role screens for",
      skills: ["Picking the one credential the target adverts actually name", "Passing it in a bounded study window"],
      courses: [COURSES.azureAiFundamentals, COURSES.architectCert],
      drill: "Read five adverts for the target title. Count which certification appears most. Book that exam six weeks out and study from the official guide only.",
      measure: "One booked exam date, then one credential on the CV.",
    },
  },
  {
    match: /\b(budget|revenue|p&l|financial|cost)\b/i,
    entry: {
      key: "gap-money",
      area: "Money responsibility",
      skills: ["Framing what you did control in money terms", "Owning a spend line, however small"],
      courses: [COURSES.interviewingUMD],
      drill: "List every figure you influenced, even indirectly: supplies, vendor spend, hours saved at a rate. Turn the largest into one CV line with the number.",
      measure: "At least one CV line with a currency figure you can defend.",
    },
  },
];

const fallbackGap = (gap: string): Omit<PlanEntry, "before" | "after" | "why"> => ({
  key: "gap-other",
  area: gap,
  skills: ["The nearest real experience you have, framed honestly", "One small piece of work that closes part of the gap"],
  courses: [COURSES.proofOfWork],
  drill: "Write down the closest thing you have done. Then do one small piece of the missing thing this month and write that down too.",
  measure: "You have an answer to 'where is the closest thing you have done' that ends with something recent.",
});

// ── builder ─────────────────────────────────────────────────

export type SkillPlanInput = {
  /** Interview Coach rubric keys, weakest first. */
  weakRubric?: string[];
  /** Career Compass dimensions, weakest first. */
  weakDimensions?: CompassDimension[];
  /** What the target role expects that the CV does not show. */
  missingForTarget?: string[];
  /** Their own weak example and its strong version, keyed by rubric key or dimension. */
  examples?: Record<string, { before: string; after: string }>;
  /** Cap on entries. Three is a plan; six is a syllabus. */
  max?: number;
};

export function buildSkillPlan(input: SkillPlanInput): PlanEntry[] {
  const out: PlanEntry[] = [];
  const seen = new Set<string>();
  const push = (entry: PlanEntry) => {
    if (seen.has(entry.key)) return;
    seen.add(entry.key);
    out.push(entry);
  };

  for (const k of input.weakRubric ?? []) {
    const base = RUBRIC_PLANS[k];
    if (base) push({ ...base, ...(input.examples?.[k] ?? {}) });
  }
  for (const d of input.weakDimensions ?? []) {
    const base = DIMENSION_PLANS[d];
    if (base) push({ ...base, ...(input.examples?.[d] ?? {}) });
  }
  for (const gap of input.missingForTarget ?? []) {
    const text = String(gap ?? "").trim();
    if (!text) continue;
    const rule = GAP_RULES.find((r) => r.match.test(text));
    const base = rule ? rule.entry : fallbackGap(text);
    push({ ...base, why: `The role expects ${text.replace(/\.$/, "")}, and your CV does not show it. Better to close part of it than to be surprised by the question.` });
  }

  return out.slice(0, input.max ?? 3);
}

/** Plain text, for lead notes and the alert email. */
export function formatSkillPlan(plan: PlanEntry[]): string[] {
  return plan.flatMap((p) => [
    `${p.area}: ${p.why}`,
    ...(p.before ? [`  Before: ${p.before.slice(0, 240)}`] : []),
    ...(p.after ? [`  After: ${p.after.slice(0, 240)}`] : []),
    `  Skills: ${p.skills.join("; ")}`,
    `  Courses: ${p.courses.map((c) => `${c.name} (${c.provider}, ${c.cost})`).join("; ")}`,
    `  Drill: ${p.drill}`,
    `  Done when: ${p.measure}`,
  ]);
}
