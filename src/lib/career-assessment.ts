// ============================================================
// src/lib/career-assessment.ts — the Career Compass assessment.
//
// Distinct from src/lib/assessment-content.ts, which scores an ORGANISATION's
// AI readiness (ASCEND) for the B2B funnel. This one scores an INDIVIDUAL job
// seeker and, just as importantly, captures what they actually want from
// their next job so we can act on it.
//
// Two halves, deliberately separate:
//   1. PREFERENCES — what they're looking for. Not scored. This is the lead
//      intelligence: target role, pay, arrangement, timeline, obstacle.
//   2. COMPASS — seven scored dimensions producing a 0-100 readiness score.
//
// Consumed by /career-assessment, /api/career-assessment/submit and
// /api/career-assessment/report.
// ============================================================

export const ASSESSMENT_NAME = "Career Compass";

// ── PART 1: WHAT THEY WANT ──────────────────────────────────
// Every field here is capture, not scoring. Keep the ids stable — they are
// persisted in lead notes and read back by hand.

export type PreferenceField = {
  id: string;
  question: string;
  helpText?: string;
  /** multi lets the applicant pick several; maxChoices caps it. */
  multi?: boolean;
  maxChoices?: number;
  options: { value: string; label: string }[];
};

export const PREFERENCE_FIELDS: PreferenceField[] = [
  {
    id: "situation",
    question: "Where are you right now?",
    options: [
      { value: "employed-looking", label: "Employed, actively looking to move" },
      { value: "employed-exploring", label: "Employed, quietly exploring options" },
      { value: "unemployed-looking", label: "Not working, actively looking" },
      { value: "redundant", label: "Recently made redundant" },
      { value: "returning", label: "Returning to work after a break" },
      { value: "student", label: "Student or recent graduate" },
      { value: "self-employed", label: "Self-employed, want something steadier" },
      { value: "career-change", label: "Employed, but changing field entirely" },
    ],
  },
  {
    id: "targetField",
    question: "What kind of role are you going for?",
    helpText: "Pick the closest. You can name the exact title in a moment.",
    options: [
      { value: "ai-automation", label: "AI / automation specialist" },
      { value: "data-analyst", label: "Data or business analyst" },
      { value: "ops", label: "Operations / business support" },
      { value: "project", label: "Project or programme management" },
      { value: "software-it", label: "Software or IT" },
      { value: "customer", label: "Customer success or support" },
      { value: "marketing", label: "Marketing or communications" },
      { value: "finance", label: "Finance or accounting" },
      { value: "hr", label: "HR or people" },
      { value: "healthcare", label: "Healthcare — clinical ops or admin" },
      { value: "sales", label: "Sales or business development" },
      { value: "admin", label: "Administration or executive support" },
      { value: "teaching", label: "Teaching, training or L&D" },
      { value: "unsure", label: "Honestly, I'm not sure yet" },
    ],
  },
  {
    id: "experience",
    question: "How much working experience do you have?",
    options: [
      { value: "0-1", label: "Under a year" },
      { value: "1-3", label: "1 to 3 years" },
      { value: "4-7", label: "4 to 7 years" },
      { value: "8-15", label: "8 to 15 years" },
      { value: "15+", label: "More than 15 years" },
    ],
  },
  {
    id: "salary",
    question: "What do you need your next role to pay?",
    helpText: "Annual, before tax. We use this to tell you whether your target is realistic.",
    options: [
      { value: "under-40", label: "Under $40k" },
      { value: "40-60", label: "$40k – $60k" },
      { value: "60-85", label: "$60k – $85k" },
      { value: "85-120", label: "$85k – $120k" },
      { value: "120-160", label: "$120k – $160k" },
      { value: "160+", label: "$160k+" },
      { value: "unsure", label: "I don't know what to ask for" },
    ],
  },
  {
    id: "arrangement",
    question: "How do you want to work?",
    options: [
      { value: "remote", label: "Fully remote" },
      { value: "hybrid", label: "Hybrid" },
      { value: "onsite", label: "On-site" },
      { value: "any", label: "No strong preference" },
    ],
  },
  {
    id: "timeline",
    question: "When do you want to be in the new role?",
    options: [
      { value: "now", label: "Yesterday — I'm applying now" },
      { value: "3m", label: "Within 3 months" },
      { value: "6m", label: "3 to 6 months" },
      { value: "12m", label: "6 to 12 months" },
      { value: "exploring", label: "No deadline, just exploring" },
    ],
  },
  {
    id: "priorities",
    question: "What matters most in the next job?",
    helpText: "Pick up to three. Being honest here is more useful than being impressive.",
    multi: true,
    maxChoices: 3,
    options: [
      { value: "pay", label: "Significantly better pay" },
      { value: "flexibility", label: "Flexibility and remote work" },
      { value: "security", label: "Job security and stability" },
      { value: "growth", label: "Learning and skill growth" },
      { value: "change", label: "Breaking into a different field" },
      { value: "management", label: "Better management than I have now" },
      { value: "impact", label: "Work that means something" },
      { value: "leadership", label: "A route into leadership" },
      { value: "balance", label: "Less stress, better balance" },
      { value: "ai-work", label: "Working with AI rather than being replaced by it" },
    ],
  },
  {
    id: "obstacle",
    question: "What is actually stopping you right now?",
    helpText: "The honest answer, not the polite one.",
    options: [
      { value: "no-responses", label: "I apply and hear nothing back" },
      { value: "no-proof", label: "I have nothing concrete to show for my work" },
      { value: "skills", label: "I'm missing the AI or technical skills being asked for" },
      { value: "network", label: "I don't know anyone who can get me in the door" },
      { value: "interviews", label: "I get interviews but don't convert them" },
      { value: "direction", label: "I don't know what I should be targeting" },
      { value: "experience", label: "Every role wants more experience than I have" },
      { value: "confidence", label: "Confidence — I talk myself out of applying" },
      { value: "gap", label: "A career gap I struggle to explain" },
      { value: "overlooked", label: "I think I'm being screened out unfairly" },
    ],
  },
];

// ── PART 2: THE COMPASS DIMENSIONS ──────────────────────────

export type CompassDimension =
  | "Clarity"
  | "Offer"
  | "Momentum"
  | "Proof"
  | "AI Fluency"
  | "Signal"
  | "Search Mechanics";

export const COMPASS_DIMENSIONS: Record<
  CompassDimension,
  { letter: string; blurb: string; color: string }
> = {
  Clarity: {
    letter: "C",
    blurb: "You know exactly which role you're going for, and why you fit it.",
    color: "#3B82F6",
  },
  Offer: {
    letter: "O",
    blurb: "You can state what you deliver in terms an employer values, and what it's worth.",
    color: "#8B5CF6",
  },
  Momentum: {
    letter: "M",
    blurb: "You work the search consistently instead of in bursts, and you track it.",
    color: "#F59E0B",
  },
  Proof: {
    letter: "P",
    blurb: "You have evidence of your work, not just claims about it.",
    color: "#10B981",
  },
  "AI Fluency": {
    letter: "A",
    blurb: "You use AI the way employers now expect, and you know where it fails.",
    color: "#EC4899",
  },
  Signal: {
    letter: "S",
    blurb: "The right people can find you, and someone will vouch for you.",
    color: "#06B6D4",
  },
  "Search Mechanics": {
    letter: "S",
    blurb: "Your CV survives screening and your interviews convert.",
    color: "#EF4444",
  },
};

export type CompassQuestion = {
  id: string;
  dimension: CompassDimension;
  questionText: string;
  helpText: string;
  options: { value: number; label: string; description: string }[];
};

// Fourteen questions, two per dimension. Every option ladder runs 1 (weakest)
// to 5 (strongest) so scoring stays a plain average — do not reorder options.
export const COMPASS_QUESTIONS: CompassQuestion[] = [
  {
    id: "c1",
    dimension: "Clarity",
    questionText: "How specific is the job you're going after?",
    helpText:
      "Vague targets produce vague applications. The single biggest predictor of a fast search is being able to name the role, not a category.",
    options: [
      { value: 1, label: "No idea", description: "I'd take more or less anything that pays." },
      { value: 2, label: "A general direction", description: "I know the field, not the role." },
      { value: 3, label: "A few job titles", description: "I'm applying across several different kinds of role." },
      { value: 4, label: "One clear title", description: "I know the role and roughly what it involves." },
      { value: 5, label: "Title and targets", description: "I know the role and can name companies hiring for it now." },
    ],
  },
  {
    id: "c2",
    dimension: "Clarity",
    questionText: "Can you say why you're right for that role in thirty seconds?",
    helpText:
      "This is the answer to 'tell me about yourself' and the first line of every message you send. If it isn't sharp, nothing downstream works.",
    options: [
      { value: 1, label: "No", description: "I ramble, or I freeze." },
      { value: 2, label: "Badly", description: "I list my job history and hope they connect the dots." },
      { value: 3, label: "Roughly", description: "I can get there, but it takes a few minutes." },
      { value: 4, label: "Yes", description: "I have a clear answer I've used more than once." },
      { value: 5, label: "Yes, and it lands", description: "I've tested it and people respond to it." },
    ],
  },
  {
    id: "o1",
    dimension: "Offer",
    questionText: "How do you describe what you do — duties, or results?",
    helpText:
      "Employers buy outcomes. 'Responsible for scheduling' is a duty. 'Cut rota conflicts by 60% and saved four hours a week' is an outcome, and it gets interviews.",
    options: [
      { value: 1, label: "Duties only", description: "My CV is a list of what I was responsible for." },
      { value: 2, label: "Mostly duties", description: "One or two achievements, but no numbers." },
      { value: 3, label: "A mix", description: "Some results, though I struggle to quantify them." },
      { value: 4, label: "Mostly results", description: "Most points name an outcome, several with numbers." },
      { value: 5, label: "Results with evidence", description: "Every claim has a number and I can back it up." },
    ],
  },
  {
    id: "o2",
    dimension: "Offer",
    questionText: "Do you know what your target role actually pays?",
    helpText:
      "Not knowing the range is how people get anchored low for years. It also tells you whether your target and your salary need are compatible at all.",
    options: [
      { value: 1, label: "No idea", description: "I'd accept whatever was offered." },
      { value: 2, label: "A vague sense", description: "I've heard numbers but haven't checked." },
      { value: 3, label: "Roughly", description: "I know a ballpark for my area." },
      { value: 4, label: "Yes", description: "I know the range and where I sit in it." },
      { value: 5, label: "Yes, and I've negotiated", description: "I know the range and have successfully asked for more." },
    ],
  },
  {
    id: "m1",
    dimension: "Momentum",
    questionText: "In a normal week, how much focused time goes into the search?",
    helpText:
      "Searching in bursts after a bad day at work is why searches drag on for a year. Consistency beats intensity, every time.",
    options: [
      { value: 1, label: "Almost none", description: "I look when I'm frustrated, then stop." },
      { value: 2, label: "Under an hour", description: "A scroll through listings now and then." },
      { value: 3, label: "One to three hours", description: "I apply to things when I see them." },
      { value: 4, label: "Three to six hours", description: "I have a routine and mostly keep to it." },
      { value: 5, label: "Six or more, planned", description: "Scheduled time, with specific goals for each block." },
    ],
  },
  {
    id: "m2",
    dimension: "Momentum",
    questionText: "Do you track applications, responses and follow-ups?",
    helpText:
      "Without tracking you can't tell whether your CV, your targeting, or your interviewing is the problem. You just feel like it isn't working.",
    options: [
      { value: 1, label: "Not at all", description: "I couldn't tell you who I applied to last month." },
      { value: 2, label: "In my head", description: "I mostly remember the big ones." },
      { value: 3, label: "A rough list", description: "Somewhere in my notes or email." },
      { value: 4, label: "A proper tracker", description: "A sheet with dates, status and follow-ups." },
      { value: 5, label: "Tracked and reviewed", description: "I track it and review what my response rate is telling me." },
    ],
  },
  {
    id: "p1",
    dimension: "Proof",
    questionText: "If an employer asked to see something you've actually done, what could you show them today?",
    helpText:
      "This is the question that separates candidates. Almost everyone can describe their work. Very few can show it. The ones who can stop competing on credentials.",
    options: [
      { value: 1, label: "Nothing", description: "Just my CV and what I say in interviews." },
      { value: 2, label: "A reference", description: "Someone who'd vouch for me, but nothing to look at." },
      { value: 3, label: "Something rough", description: "Files or work I'd have to explain and tidy first." },
      { value: 4, label: "One solid piece", description: "Something finished I'd be comfortable sending." },
      { value: 5, label: "A published portfolio", description: "A link showing several pieces of real work and their results." },
    ],
  },
  {
    id: "p2",
    dimension: "Proof",
    questionText: "Can you point to a measurable result from your work?",
    helpText:
      "A before and a after, as numbers. This is what makes a claim checkable, and checkable claims are what get remembered after the interview.",
    options: [
      { value: 1, label: "No", description: "I've never measured what I do." },
      { value: 2, label: "Not really", description: "I know I improved things but couldn't put a figure on it." },
      { value: 3, label: "One or two", description: "I have some numbers, though I'd have to dig." },
      { value: 4, label: "Several", description: "I can name specific results with figures attached." },
      { value: 5, label: "Baseline and result", description: "I measured before and after, and can show the working." },
    ],
  },
  {
    id: "a1",
    dimension: "AI Fluency",
    questionText: "How do you actually use AI in your work?",
    helpText:
      "Employers have stopped asking whether you've heard of AI. They're asking what you've done with it. The gap between those two is where the jobs are.",
    options: [
      { value: 1, label: "I don't", description: "I've barely touched it." },
      { value: 2, label: "Occasionally, for text", description: "Rewriting emails, tidying up wording." },
      { value: 3, label: "Regularly", description: "It's part of my week for drafting, summarising and research." },
      { value: 4, label: "For real tasks", description: "I've used it to change how a piece of my job gets done." },
      { value: 5, label: "I've built something", description: "An automation or assistant that runs without me." },
    ],
  },
  {
    id: "a2",
    dimension: "AI Fluency",
    questionText: "Could you explain where AI gets it wrong in your work?",
    helpText:
      "Anyone can demo a tool. Knowing where it fails, and saying so, is what makes someone safe to hire. It is the rarest thing on this whole assessment.",
    options: [
      { value: 1, label: "No", description: "I wouldn't know what to look for." },
      { value: 2, label: "In general terms", description: "I know it 'makes things up' but not where or when." },
      { value: 3, label: "From experience", description: "I've been caught out and now I check." },
      { value: 4, label: "Specifically", description: "I know the failure modes for the tasks I use it on." },
      { value: 5, label: "Documented", description: "I've written down the limits and what a human must check." },
    ],
  },
  {
    id: "s1",
    dimension: "Signal",
    questionText: "How likely is it that a recruiter finds you without you applying?",
    helpText:
      "A large share of hiring never reaches a public advert. If you can only be found by applying, you're competing in the most crowded part of the market.",
    options: [
      { value: 1, label: "No chance", description: "I have almost no professional presence online." },
      { value: 2, label: "Unlikely", description: "A profile exists but it's out of date." },
      { value: 3, label: "Sometimes", description: "I get the occasional irrelevant message." },
      { value: 4, label: "Fairly likely", description: "My profile is current and targeted, and approaches happen." },
      { value: 5, label: "Regularly", description: "Relevant people approach me without me applying." },
    ],
  },
  {
    id: "s2",
    dimension: "Signal",
    questionText: "How many people could you message today who would genuinely help you get an interview?",
    helpText:
      "Referrals convert several times better than cold applications. This is a count of real relationships, not connections.",
    options: [
      { value: 1, label: "None", description: "I'd be starting from nothing." },
      { value: 2, label: "One or two", description: "And I'd feel awkward asking." },
      { value: 3, label: "A handful", description: "Three to five people who know my work." },
      { value: 4, label: "A real network", description: "Six to fifteen, and I'm comfortable asking." },
      { value: 5, label: "Deep and active", description: "Many, and I'm in regular contact rather than only asking when I need something." },
    ],
  },
  {
    id: "sm1",
    dimension: "Search Mechanics",
    questionText: "How well does your CV survive screening?",
    helpText:
      "Most applications are filtered before a human reads them, and the humans who do read spend seconds. Both filters have to be passed on purpose.",
    options: [
      { value: 1, label: "Unknown", description: "It's the same CV I've had for years." },
      { value: 2, label: "Probably badly", description: "One generic CV sent to everything." },
      { value: 3, label: "Lightly tailored", description: "I swap a few words per application." },
      { value: 4, label: "Properly tailored", description: "Rewritten per role, keywords matched to the advert." },
      { value: 5, label: "Tested and tuned", description: "Tailored, screening-tested, and I know my response rate." },
    ],
  },
  {
    id: "sm2",
    dimension: "Search Mechanics",
    questionText: "Once you get an interview, how does it usually go?",
    helpText:
      "If applications are converting but interviews aren't, the fix is completely different from a CV problem. This tells us which one you have.",
    options: [
      { value: 1, label: "I don't get them", description: "I rarely make it that far." },
      { value: 2, label: "Badly", description: "I get flustered and I know I underperform." },
      { value: 3, label: "Mixed", description: "Some go well, some fall apart, I'm not sure why." },
      { value: 4, label: "Usually well", description: "I prepare properly and often reach later stages." },
      { value: 5, label: "They convert", description: "I get to final stages or offers most times." },
    ],
  },
];

// ── SCORING ─────────────────────────────────────────────────

export type Band = {
  id: "finding" | "building" | "ready" | "competitive";
  /** Maps onto the leads table's assessment_band CHECK constraint. */
  legacy: "early" | "developing" | "advanced";
  label: string;
  summary: string;
  min: number;
};

// Ordered strongest first so getBand can return the first match.
export const BANDS: Band[] = [
  {
    id: "competitive",
    legacy: "advanced",
    label: "Competitive",
    summary:
      "You are genuinely ready. The work now is targeting and negotiation, not preparation. Do not let a strong position turn into a slow one.",
    min: 85,
  },
  {
    id: "ready",
    legacy: "advanced",
    label: "Market ready",
    summary:
      "You can compete for your target role today. One or two specific gaps are costing you interviews you would otherwise get.",
    min: 65,
  },
  {
    id: "building",
    legacy: "developing",
    label: "Building your case",
    summary:
      "You have real substance but it is not yet visible to employers. This is the most common place to be, and the fastest to move out of.",
    min: 40,
  },
  {
    id: "finding",
    legacy: "early",
    label: "Finding your direction",
    summary:
      "The foundations are not in place yet. That is fixable, and it is far better to know now than after six months of applications that go nowhere.",
    min: 0,
  },
];

export function getBand(score: number): Band {
  return BANDS.find((b) => score >= b.min) ?? BANDS[BANDS.length - 1];
}

/** Average of the two answers in each dimension, on the original 1-5 scale. */
export function calculateDimensionScores(
  answers: Record<string, number>
): Record<CompassDimension, number> {
  const totals = {} as Record<CompassDimension, { sum: number; count: number }>;
  for (const q of COMPASS_QUESTIONS) {
    const a = answers[q.id];
    if (typeof a !== "number") continue;
    if (!totals[q.dimension]) totals[q.dimension] = { sum: 0, count: 0 };
    totals[q.dimension].sum += a;
    totals[q.dimension].count += 1;
  }
  const out = {} as Record<CompassDimension, number>;
  for (const [dim, { sum, count }] of Object.entries(totals) as [
    CompassDimension,
    { sum: number; count: number },
  ][]) {
    out[dim] = count ? Math.round((sum / count) * 10) / 10 : 0;
  }
  return out;
}

/**
 * 0-100 across every answered question. Uses answered questions as the
 * denominator so a partial set still scores sensibly rather than collapsing.
 */
export function calculateOverallScore(answers: Record<string, number>): number {
  const values = COMPASS_QUESTIONS.map((q) => answers[q.id]).filter(
    (v): v is number => typeof v === "number"
  );
  if (!values.length) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round(((sum - values.length) / (values.length * 4)) * 100);
}

export function isComplete(answers: Record<string, number>): boolean {
  return COMPASS_QUESTIONS.every((q) => typeof answers[q.id] === "number");
}

/** Weakest first — the order we present fixes in. */
export function rankDimensions(
  dimensionScores: Record<CompassDimension, number>
): CompassDimension[] {
  return (Object.keys(dimensionScores) as CompassDimension[]).sort(
    (a, b) => dimensionScores[a] - dimensionScores[b]
  );
}

// ── WHAT TO DO ABOUT IT ─────────────────────────────────────
// One concrete first action per dimension. Deliberately doable in a week —
// advice a job seeker cannot act on within seven days is advice they drop.

export const DIMENSION_ACTIONS: Record<
  CompassDimension,
  { diagnosis: string; action: string; week1: string }
> = {
  Clarity: {
    diagnosis:
      "You are applying across too wide a range, so every application reads as generic to the person receiving it.",
    action:
      "Pick one job title and commit to it for thirty days. Breadth feels safer and performs worse.",
    week1:
      "Find ten live adverts for one title. Write down the five requirements that appear in most of them. That list is your target.",
  },
  Offer: {
    diagnosis:
      "Your experience is described as responsibilities rather than results, so employers cannot tell what changed because you were there.",
    action:
      "Rewrite your three most recent roles as outcomes with numbers attached.",
    week1:
      "Take one thing you did last month. Write down what it was like before, what you did, and what it was like after. Put a number on it.",
  },
  Momentum: {
    diagnosis:
      "The search happens in bursts, which means long gaps where nothing moves and no learning accumulates.",
    action:
      "Book two fixed blocks a week in your calendar and track every application in one place.",
    week1:
      "Make a tracker with five columns: company, role, date applied, status, next action. Backfill the last month.",
  },
  Proof: {
    diagnosis:
      "You have nothing an employer can look at. You are competing on claims, against people who compete on evidence.",
    action:
      "Build and publish one piece of real work with a measured result. One is enough to change the conversation.",
    week1:
      "Pick one task you do every week. Time it. That baseline is the first line of the portfolio piece you are going to publish.",
  },
  "AI Fluency": {
    diagnosis:
      "Employers are now asking what you have done with AI, not whether you have used it. You do not yet have an answer with substance.",
    action:
      "Use AI to change how one real task in your work gets done, then be able to say where it fails.",
    week1:
      "Take the most repetitive task you own. Try to do it with AI three times. Write down what it got wrong each time.",
  },
  Signal: {
    diagnosis:
      "You can only be found by applying, which puts you in the most crowded and least favourable part of the market.",
    action:
      "Make your profile match your target role, then have real conversations with people already doing it.",
    week1:
      "Rewrite your headline and summary for the one title you are targeting. Message three people doing that job — ask about the work, do not ask for a job.",
  },
  "Search Mechanics": {
    diagnosis:
      "Applications are being filtered before a person considers you, or interviews are not converting once you get them.",
    action:
      "Tailor properly to each advert and rehearse your answers out loud rather than in your head.",
    week1:
      "Take one advert. Rewrite your CV against its exact wording. Compare the two side by side and note what you had been leaving out.",
  },
};

/**
 * Deterministic role guidance shown instantly, before any AI call. Compares
 * what they are targeting against what their answers currently support, and
 * names an adjacent role when the target is a stretch.
 */
export function getRoleMatch(
  targetField: string | undefined,
  dimensionScores: Record<CompassDimension, number>,
  overall: number
): { verdict: string; detail: string; adjacent: string[] } {
  const ai = dimensionScores["AI Fluency"] ?? 0;
  const proof = dimensionScores.Proof ?? 0;

  const AI_HEAVY = ["ai-automation", "data-analyst", "software-it"];
  const stretch = targetField ? AI_HEAVY.includes(targetField) : false;

  if (targetField === "unsure") {
    return {
      verdict: "Direction first, applications second",
      detail:
        "You have not settled on a target, and that single gap is holding back everything else. Applications sent without a target get generic responses, or none. Fix this before you send anything else.",
      adjacent: [
        "Pick the role family closest to work you already do",
        "Talk to three people doing the job before you commit to it",
      ],
    };
  }

  if (stretch && (ai < 3 || proof < 3)) {
    return {
      verdict: "Your target is a stretch from where you are today",
      detail:
        "The roles you are aiming at expect demonstrable AI work and something an employer can look at. On both of those you are currently below the bar, which is why applications are not converting. This is a gap you can close in weeks, not years — but not by applying harder.",
      adjacent: [
        "Roles adjacent to your target that value the domain knowledge you already have",
        "The same target, six to eight weeks from now, with one published piece of work behind you",
      ],
    };
  }

  if (overall >= 65) {
    return {
      verdict: "Your target is realistic right now",
      detail:
        "Your profile supports the role you are going for. From here it is a numbers and targeting problem rather than a readiness problem, so the priority is volume of well-aimed applications and warm introductions rather than more preparation.",
      adjacent: [
        "A level up from your stated target — you may be aiming low",
        "The same role in a sector where your background is scarcer and therefore worth more",
      ],
    };
  }

  return {
    verdict: "Reachable, with two things fixed first",
    detail:
      "Nothing in your answers rules out the role you want. What is missing is visible evidence and a sharper way of describing what you deliver. Both are fixable, and both matter more than another round of applications.",
    adjacent: [
      "Your target role at a smaller organisation, where breadth counts for more",
      "An adjacent role that gets you the evidence, then the target six months later",
    ],
  };
}
