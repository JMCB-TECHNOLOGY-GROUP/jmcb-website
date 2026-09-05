import { describe, it, expect } from "vitest";
import {
  MAX_QUESTIONS,
  RUBRIC,
  buildPersona,
  buildQuestionPlan,
  buildCvFacts,
  answerSignals,
  heuristicScore,
  normalizeScore,
  groundBetterAnswer,
  debriefFrom,
  buildTurnPrompt,
  buildDebriefPrompt,
  type Turn,
} from "./interview-coach";

const ev = (value: string) => ({ value, evidence: value });

const dutiesCv = {
  currentTitle: "Office Manager",
  industries: ["Dental"],
  skillGroups: [{ category: "Admin", skills: [ev("Scheduling"), ev("Dentrix")] }],
  quantifiedAchievements: [],
  unquantifiedClaims: [ev("Improved front desk efficiency"), ev("Trained new administrative staff"), ev("Managed vendors")],
  atsIssues: ["No summary"],
  missingForTarget: ["Budget responsibility", "Reporting"],
};

const resultsCv = {
  currentTitle: "Operations Lead",
  industries: [],
  skillGroups: [{ category: "Tools", skills: [ev("Power Automate")] }],
  quantifiedAchievements: [ev("Cut rota conflicts by 60%")],
  unquantifiedClaims: [],
  atsIssues: [],
  missingForTarget: [],
};

describe("persona", () => {
  it("names the role and sector and forbids invention", () => {
    const p = buildPersona("Operations Coordinator", ["Dental", "Property", "Retail"]);
    expect(p).toContain("Operations Coordinator");
    expect(p).toContain("Dental and Property");
    expect(p).toMatch(/never state anything about the candidate/);
    expect(p).not.toMatch(/[—–]/);
  });
});

describe("question plan", () => {
  it("opens and closes the same way for everyone", () => {
    const plan = buildQuestionPlan({ targetTitle: "Data Analyst" });
    expect(plan[0].kind).toBe("opener");
    expect(plan[0].text).toContain("Data Analyst");
    expect(plan[plan.length - 1].kind).toBe("closer");
  });

  it("falls back to three evidence-forcing questions without a CV", () => {
    const plan = buildQuestionPlan({ targetTitle: "Data Analyst" });
    expect(plan.map((q) => q.kind)).toEqual(["opener", "generic", "generic", "generic", "closer"]);
  });

  it("builds the middle from the CV's own weak lines, in priority order, capped", () => {
    const plan = buildQuestionPlan({ targetTitle: "Operations Coordinator", extraction: dutiesCv, answers: { a1: 4 } });
    expect(plan.length).toBeLessThanOrEqual(MAX_QUESTIONS);
    const kinds = plan.map((q) => q.kind);
    expect(kinds).toEqual(["opener", "claim", "claim", "discrepancy", "gap", "closer"]);
    expect(plan[1].text).toContain('"Improved front desk efficiency"');
    expect(plan[3].text).toMatch(/changed with AI/);
    expect(plan[3].why).toContain('"For real tasks"');
    expect(plan[4].text).toContain("Budget responsibility");
  });

  it("asks for the working behind a figure the CV already carries", () => {
    const plan = buildQuestionPlan({ targetTitle: "Ops Lead", extraction: resultsCv });
    const figure = plan.find((q) => q.kind === "figure");
    expect(figure?.text).toContain("Cut rota conflicts by 60%");
    expect(figure?.text).toMatch(/before you started/);
  });

  it("uses the results discrepancy when there is no AI gap", () => {
    const plan = buildQuestionPlan({ targetTitle: "Ops Lead", extraction: dutiesCv, answers: { o1: 4 } });
    expect(plan.find((q) => q.id === "discrepancy-results")).toBeTruthy();
    expect(plan.find((q) => q.id === "discrepancy-ai")).toBeFalsy();
  });

  it("gives every question a why and a lookingFor, with no dashes", () => {
    for (const q of buildQuestionPlan({ targetTitle: "X", extraction: dutiesCv, answers: { a1: 5 } })) {
      expect(q.why.length).toBeGreaterThan(20);
      expect(q.lookingFor.length).toBeGreaterThan(20);
      expect(q.text + q.why + q.lookingFor).not.toMatch(/[—–]/);
    }
  });
});

describe("cv facts", () => {
  it("says so when there is no CV", () => {
    expect(buildCvFacts(null)).toMatch(/No CV was provided/);
  });
  it("lists only what the extraction holds", () => {
    const facts = buildCvFacts(dutiesCv);
    expect(facts).toContain("Office Manager");
    expect(facts).toContain("Scheduling, Dentrix");
    expect(facts).toContain("Achievements with a number: none");
    expect(facts).toContain("Budget responsibility");
  });
});

describe("answer signals and heuristic score", () => {
  it("detects figures, outcomes and ownership", () => {
    const s = answerSignals("I rebuilt the rota and cut conflicts by 60% in three months. We then rolled it out.");
    expect(s.hasFigure).toBe(true);
    expect(s.hasOutcomeVerb).toBe(true);
    expect(s.ownership).toBeCloseTo(0.5);
  });

  it("caps evidence at 2 without a figure and 1 without an outcome", () => {
    expect(heuristicScore("I was responsible for the schedule and I worked with the dentists on it most days of the week.").evidence).toBe(1);
    expect(heuristicScore("I improved the schedule and the dentists noticed the difference over the following months.").evidence).toBe(2);
    expect(heuristicScore("I improved the schedule and cut conflicts by 60% over the following three months.").evidence).toBe(4);
  });

  it("marks a very short answer as unscorable", () => {
    const s = heuristicScore("Yes.");
    expect(s.structure).toBe(1);
    expect(s.note).toMatch(/too short/);
  });
});

describe("normalizeScore", () => {
  const long = "I rebuilt the rota from scratch and the conflicts dropped a lot, the dentists were happier and the front desk ran smoother from then on.";

  it("does not let the model award evidence above 2 for an answer with no figure", () => {
    const s = normalizeScore({ structure: 5, evidence: 5, relevance: 5, concision: 5, note: "Great." }, long);
    expect(s.evidence).toBe(2);
    expect(s.structure).toBe(5);
  });

  it("falls back to the heuristic for missing or absurd fields", () => {
    const s = normalizeScore({ evidence: 99, note: "" }, long);
    expect(s.evidence).toBe(2);
    expect(s.note).toMatch(/No figure/);
    expect(s.structure).toBe(heuristicScore(long).structure);
  });
});

describe("groundBetterAnswer", () => {
  it("keeps a rewrite whose figures come from the answer or the CV", () => {
    expect(groundBetterAnswer("I cut conflicts by 60% across 4 dentists.", "we cut conflicts by 60%", "four dentists")).toBe(
      "I cut conflicts by 60% across 4 dentists."
    );
  });
  it("drops a rewrite that invents a figure", () => {
    expect(groundBetterAnswer("I cut conflicts by 75%.", "we cut conflicts by 60%", "")).toBeUndefined();
  });
  it("lets placeholders through", () => {
    expect(groundBetterAnswer("I cut conflicts by [X]%.", "we cut conflicts", "")).toBe("I cut conflicts by [X]%.");
  });
});

describe("debrief", () => {
  const turn = (structure: number, evidence: number): Turn => ({
    questionId: "x",
    question: "q",
    answer: "a",
    score: { structure, evidence, relevance: 3, concision: 4, note: "" },
  });

  it("averages the rubric and maps to 0-100", () => {
    const d = debriefFrom([turn(5, 5), turn(5, 5)]);
    expect(d.averages.structure).toBe(5);
    expect(d.averages.concision).toBe(4);
    expect(d.overall).toBe(Math.round(((4.25 - 1) / 4) * 100));
    expect(d.strongest).toBe("structure");
    expect(d.weakest).toBe("relevance");
    expect(d.band.label).toBe("Ready");
  });

  it("names the weakest rubric line and bands honestly", () => {
    // averages 2, 1, 3, 4 = mean 2.5 = 38/100, which is honestly "Not yet"
    const d = debriefFrom([turn(2, 1), turn(2, 1)]);
    expect(d.weakest).toBe("evidence");
    expect(d.overall).toBe(38);
    expect(d.band.label).toBe("Not yet");
    expect(debriefFrom([turn(3, 2), turn(3, 2)]).band.label).toBe("Building");
  });

  it("scores an empty session as zero", () => {
    expect(debriefFrom([]).overall).toBe(0);
  });

  it("covers every rubric key", () => {
    const d = debriefFrom([turn(3, 3)]);
    for (const r of RUBRIC) expect(d.averages[r.key]).toBe(r.key === "concision" ? 4 : 3);
  });
});

describe("prompts", () => {
  const session = {
    targetTitle: "Ops Lead",
    persona: buildPersona("Ops Lead"),
    cvFacts: buildCvFacts(dutiesCv),
    questions: buildQuestionPlan({ targetTitle: "Ops Lead", extraction: dutiesCv }),
  };

  it("carries the persona, facts, question and grounding rule into the turn prompt", () => {
    const p = buildTurnPrompt(session, [], session.questions[1], "I improved things", answerSignals("I improved things"), true);
    expect(p).toContain("hiring manager");
    expect(p).toContain("Office Manager");
    expect(p).toContain(session.questions[1].text);
    expect(p).toMatch(/NO figure/);
    expect(p).toMatch(/Never invent a number/);
    expect(p).toMatch(/ONE short follow-up/);
  });

  it("forbids a follow-up when told to", () => {
    expect(buildTurnPrompt(session, [], session.questions[0], "x", answerSignals("x"), false)).toMatch(/followUp: empty string/);
  });

  it("asks the debrief for coach notes", () => {
    const turns: Turn[] = [{ questionId: "opener", question: "q", answer: "a", score: { structure: 2, evidence: 1, relevance: 3, concision: 3, note: "" } }];
    const p = buildDebriefPrompt(session, turns, debriefFrom(turns));
    expect(p).toContain("coachNotes");
    expect(p).toContain("Weakest: Evidence");
  });
});
