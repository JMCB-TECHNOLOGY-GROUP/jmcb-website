// ============================================================
// src/lib/program.ts — single source of truth for the Proof of Work programme.
//
// The public page (/program), the application API and the facilitator
// playbook (docs/program-playbook.md) all read from here. Editing a cohort
// means editing this file and nothing else — that is the point. When you run
// cohort two, change COHORT and the dates below; the curriculum normally
// stays put.
//
// Naming note: PROGRAM_NAME is referenced everywhere rather than hard-coded,
// so renaming the programme is a one-line change.
// ============================================================

export const PROGRAM_NAME = "Proof of Work";
export const PROGRAM_TAGLINE = "Eight weeks. Eight real projects. Proof you can do the work.";

// Live session slot. Chosen so people with day jobs can attend without
// burning a weekend, and so there is a full weekend of build time between
// the session and the next deadline.
export const SESSION_DAY = "Thursday";
export const SESSION_TIME = "7:00–8:30pm ET";

export const COHORT = {
  label: "Cohort 1",
  // Applications close a week before the info session's follow-up so there is
  // time to read them and send the welcome pack.
  applicationsClose: "2026-09-24",
  infoSession: "2026-09-17",
  startDate: "2026-10-01",
  endDate: "2026-11-19",
  seats: 40,
} as const;

// Every live session date, in order. Week N is SESSION_DATES[N - 1].
// All Thursdays; verified by src/lib/program.test.ts.
export const SESSION_DATES = [
  "2026-10-01",
  "2026-10-08",
  "2026-10-15",
  "2026-10-22",
  "2026-10-29",
  "2026-11-05",
  "2026-11-12",
  "2026-11-19",
] as const;

// The five capability areas the eight weeks add up to. Kept deliberately
// short — these are what a graduate can claim, not a syllabus.
export const SKILL_AREAS = [
  {
    name: "Frame the problem",
    desc: "Define what is actually broken, and what better would measurably look like, before reaching for a tool.",
  },
  {
    name: "Work with AI deliberately",
    desc: "Prompting as an engineering discipline: structured output, tested against a rubric, versioned like code.",
  },
  {
    name: "Verify and disclose",
    desc: "Check the model's work, find where it fails, and state the limits out loud. The habit most training skips.",
  },
  {
    name: "Automate and build",
    desc: "Ship a working automation and a tool-using assistant against a real system, with a human in the loop.",
  },
  {
    name: "Show the result",
    desc: "Demo in two minutes, write the one-page memo, and publish the evidence where someone can check it.",
  },
] as const;

export type Week = {
  week: number;
  date: string;
  theme: string;
  skill: string;
  /** The artefact the participant ships that week. Named, not described. */
  project: string;
  brief: string;
  /** What "done" means. Used verbatim as the marking rubric in the playbook. */
  rubric: string[];
};

// Eight weeks, eight shipped artefacts. Each project builds on the last and
// all of them attach to ONE real task the participant brings in week 1 —
// that continuity is what turns eight exercises into one portfolio.
export const WEEKS: Week[] = [
  {
    week: 1,
    date: SESSION_DATES[0],
    theme: "Start with the problem, not the tool",
    skill: "Frame the problem",
    project: "The Problem Brief",
    brief:
      "Pick one recurring task from your job, volunteer role or studies — something you personally do at least weekly. Time it honestly for a week. Map every step. Write a one-page brief stating the task, the current time and cost, who it affects, and what a measurably better version looks like. This task is your through-line for all eight weeks.",
    rubric: [
      "A real, recurring task the participant owns — not a hypothetical",
      "A measured baseline: minutes per run, runs per week, who is affected",
      "A success measure stated as a number, not an adjective",
      "Fits on one page",
    ],
  },
  {
    week: 2,
    date: SESSION_DATES[1],
    theme: "Prompting is engineering, not conversation",
    skill: "Work with AI deliberately",
    project: "The Reusable Prompt",
    brief:
      "Turn week 1's task into a prompt someone else could run and get the same quality. Define the output structure. Write a five-point rubric for a good answer. Run it five times on five real inputs, score each against your rubric, and document every failure mode you hit.",
    rubric: [
      "Prompt is parameterised and reusable, not a one-off chat",
      "Output structure is specified and consistently produced",
      "Five real runs, scored against the participant's own rubric",
      "Failure modes documented, including at least one the participant did not expect",
    ],
  },
  {
    week: 3,
    date: SESSION_DATES[2],
    theme: "Assume it is wrong until you have checked",
    skill: "Verify and disclose",
    project: "The Red-Team Report",
    brief:
      "Attack your own week 2 output. Where does it fabricate? What does it get confidently wrong on edge cases? Whose data went into the prompt, and should it have? Produce a one-page limits-and-disclosure note: what this prompt must not be used for, what a human must check every time, and the disclosure line that goes to anyone receiving its output.",
    rubric: [
      "At least three concrete failures found and reproduced, not speculated",
      "A privacy pass: what data goes in, and whether it should",
      "A stated 'do not use this for…' boundary",
      "A disclosure line a real recipient would understand",
    ],
  },
  {
    week: 4,
    date: SESSION_DATES[3],
    theme: "Numbers you can defend",
    skill: "Show the result",
    project: "The One-Chart Answer",
    brief:
      "Take a real, messy public dataset connected to your problem or your community — a local budget, 311 calls, inspection records, public health statistics. Clean it with AI assistance, then answer exactly one question with exactly one chart. Write the three caveats a sceptical reader would raise, and answer them.",
    rubric: [
      "Real public data, cited with a working source link",
      "One question, one chart, an honest axis and a title that states the finding",
      "Cleaning steps documented well enough to repeat",
      "Three caveats named and addressed, including what the data cannot show",
    ],
  },
  {
    week: 5,
    date: SESSION_DATES[4],
    theme: "Make it run without you",
    skill: "Automate and build",
    project: "The Automation",
    brief:
      "Build a working automation for the week 1 task, end to end, in whatever your workplace actually allows — Power Automate, Apps Script, Zapier, Make, a script, a Claude Project. It must run on real input and produce real output without you babysitting it. Measure the new time-per-run against your week 1 baseline.",
    rubric: [
      "Runs end to end on real input, demonstrated live",
      "Before-and-after timing against the week 1 baseline",
      "Failure handling: what happens when the input is malformed",
      "Someone other than the participant could run it from the written steps",
    ],
  },
  {
    week: 6,
    date: SESSION_DATES[5],
    theme: "An assistant that uses tools",
    skill: "Automate and build",
    project: "The Assistant",
    brief:
      "Build an assistant that uses at least two tools against a real system — reading a document store, querying a sheet, calling an API, sending a draft for approval. Put a human approval step in front of anything it changes. Write ten test cases, run them, and report your pass rate honestly.",
    rubric: [
      "Two or more working tools, against something real rather than mocked",
      "An explicit human-in-the-loop step before any consequential action",
      "Ten written test cases with recorded pass and fail results",
      "The participant can explain why it fails the cases it fails",
    ],
  },
  {
    week: 7,
    date: SESSION_DATES[6],
    theme: "The work is not done until someone decides",
    skill: "Show the result",
    project: "The Two-Minute Demo",
    brief:
      "Record a two-minute demo aimed at a decision maker who is not technical, and write the one-page memo that goes with it: the problem, what you built, what it measurably changed, what it costs, what you recommend. No jargon. Two minutes means two minutes.",
    rubric: [
      "Under two minutes, understandable by a non-technical viewer",
      "Leads with the result, not the technology",
      "A one-page memo ending in a specific recommendation and an ask",
      "The cost and the limits are stated, not hidden",
    ],
  },
  {
    week: 8,
    date: SESSION_DATES[7],
    theme: "Publish the evidence",
    skill: "Show the result",
    project: "The Portfolio Page",
    brief:
      "Publish one public page covering the whole eight weeks: the problem, the baseline, what you built, the measured result, and the limits you found. Link the demo. This is the artefact you send to an employer instead of describing yourself as 'AI-familiar'. Present it at graduation.",
    rubric: [
      "Publicly reachable at a link the participant controls",
      "Baseline and result both present, as numbers",
      "Limits section included — the strongest signal of a serious practitioner",
      "Presented live at graduation in five minutes or less",
    ],
  },
];

// Free core versus paid capstone. The capstone is deliberately about
// portfolio, coaching and employer exposure.
//
// GATE: do not add exam or certification preparation to the capstone until
// JMCB itself holds the practitioner certifications — same rule the /training
// page follows for its certification-prep offer. Keep these consistent.
export const TIERS = [
  {
    name: "Core",
    price: "Free",
    duration: "8 weeks",
    summary:
      "The full eight weeks, the eight projects, every live session and the digital badge. No cost, no catch, no card.",
    includes: [
      "Eight live 90-minute sessions, recorded if you have to miss one",
      "All eight project briefs, with the rubric you will be marked against",
      "Written feedback on every project you submit",
      "A cohort channel and a build partner",
      "The Proof of Work — Core digital badge on completion",
    ],
  },
  {
    name: "Capstone",
    price: "$497",
    duration: "5 further sessions",
    summary:
      "For graduates who want the portfolio taken further and put in front of people who hire. Capped at twelve, applied for after week 6.",
    includes: [
      "Everything in Core",
      "Three 1:1 coaching sessions on your portfolio and your positioning",
      "A line-by-line review of your published work by Jermaine",
      "Demo Day in front of invited employers and association partners",
      "A written reference letter describing what you actually built",
    ],
  },
] as const;

// Deliberately wider than most programmes of this kind. The constraint that
// matters is the last one: no real task, no programme.
export const ELIGIBILITY = [
  "Sixteen or older. No degree, no prior tech experience, no coding required.",
  "A computer and a reliable internet connection.",
  "About four hours a week: one 90-minute live session plus build time.",
  "A real recurring task you own — at work, in a volunteer role, or in your studies. Everything you build attaches to it.",
] as const;

// Awarded on completion. Stated plainly so nobody mistakes it for
// an accredited qualification.
export const BADGE = {
  name: "Proof of Work — Core",
  criteria: [
    "Six of eight projects submitted and marked as meeting the rubric",
    "Six of eight live sessions attended",
    "The week 8 portfolio page published and presented",
  ],
  disclaimer:
    "A digital badge issued by JMCB Technology Group. It is a record of work you completed and can be checked — not an accredited academic qualification.",
} as const;

/** Formats an ISO date as e.g. "Thursday 1 October 2026". */
export function formatSessionDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Short form for dense UI, e.g. "Thu 1 Oct". */
export function formatShortDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}
