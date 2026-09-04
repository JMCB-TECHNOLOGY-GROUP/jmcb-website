import { describe, it, expect } from "vitest";
import { COMPASS_QUESTIONS } from "./career-assessment";
import type { ResumeExtraction } from "./resume";
import {
  CROSS_CHECKED_QUESTIONS,
  DISCREPANCY_THRESHOLD,
  aiMentions,
  cvChecksFor,
  reconcile,
  formatDiscrepancyLines,
  rewriteLinkLine,
  optionLabel,
} from "./career-crosscheck";

const ev = (value: string) => ({ value, evidence: value });

const dutiesOnlyCv: ResumeExtraction = {
  currentTitle: "Office Manager",
  skillGroups: [{ category: "Admin", skills: [ev("Scheduling"), ev("Filing")] }],
  quantifiedAchievements: [],
  unquantifiedClaims: [],
  atsIssues: ["No skills section", "Two-column layout", "Dates missing on two roles", "Contact details in the header image"],
};

const resultsCv: ResumeExtraction = {
  currentTitle: "Operations Lead",
  skillGroups: [{ category: "Tools", skills: [ev("Excel"), ev("Power Automate"), ev("ChatGPT")] }],
  quantifiedAchievements: [
    ev("Cut rota conflicts by 60%"),
    ev("Saved four hours a week"),
    ev("Onboarded 12 sites"),
    ev("Reduced invoice errors by 35%"),
    ev("Handled 40 tickets a day"),
  ],
  unquantifiedClaims: [],
  atsIssues: [],
};

describe("cross-checked question set", () => {
  it("only names questions that exist in the compass", () => {
    const ids = new Set(COMPASS_QUESTIONS.map((q) => q.id));
    for (const id of CROSS_CHECKED_QUESTIONS) expect(ids.has(id)).toBe(true);
  });

  it("returns one check per cross-checked question, each on the 1-5 ladder", () => {
    const checks = cvChecksFor(resultsCv);
    expect(checks.map((c) => c.questionId)).toEqual([...CROSS_CHECKED_QUESTIONS]);
    for (const c of checks) {
      expect(c.cvScore).toBeGreaterThanOrEqual(1);
      expect(c.cvScore).toBeLessThanOrEqual(5);
      expect(c.evidence.length).toBeGreaterThan(10);
      expect(c.evidence).not.toMatch(/[—–]/);
    }
  });

  it("returns nothing without a CV, because absence is not evidence", () => {
    expect(cvChecksFor(null)).toEqual([]);
    expect(cvChecksFor(undefined)).toEqual([]);
    expect(reconcile(null, { o1: 5 })).toEqual([]);
  });
});

describe("reading the CV", () => {
  const byId = (cv: ResumeExtraction) => Object.fromEntries(cvChecksFor(cv).map((c) => [c.questionId, c]));

  it("reads a duties-only CV as the bottom of Offer and Proof", () => {
    const c = byId(dutiesOnlyCv);
    expect(c.o1.cvScore).toBe(1);
    expect(c.p2.cvScore).toBe(1);
    expect(c.o1.evidence).toMatch(/responsibilities/);
  });

  it("reads unquantified claims as one rung up from duties only", () => {
    const c = byId({ ...dutiesOnlyCv, unquantifiedClaims: [ev("Improved team morale")] });
    expect(c.o1.cvScore).toBe(2);
    expect(c.p2.cvScore).toBe(2);
    expect(c.o1.evidence).toContain("1 claim");
  });

  it("reads five quantified lines and no vague claims as the top of Offer", () => {
    const c = byId(resultsCv);
    expect(c.o1.cvScore).toBe(5);
    expect(c.o1.evidence).toContain("5 lines");
  });

  it("caps Proof at 4, since a before-and-after cannot be read off a CV", () => {
    expect(byId(resultsCv).p2.cvScore).toBe(4);
    expect(byId(resultsCv).p2.evidence).toContain("Cut rota conflicts by 60%");
  });

  it("scores screening from the count of concrete ATS problems", () => {
    expect(byId(dutiesOnlyCv).sm1.cvScore).toBe(2);
    expect(byId(dutiesOnlyCv).sm1.evidence).toContain("4 screening problems");
    expect(byId(dutiesOnlyCv).sm1.evidence).toContain("and more");
    expect(byId({ ...dutiesOnlyCv, atsIssues: ["One thing"] }).sm1.cvScore).toBe(4);
    expect(byId({ ...dutiesOnlyCv, atsIssues: ["a", "b"] }).sm1.cvScore).toBe(3);
    expect(byId(resultsCv).sm1.cvScore).toBe(4);
  });

  it("finds AI and automation mentions across skills and claims", () => {
    expect(aiMentions(resultsCv)).toEqual(["Power Automate", "ChatGPT"]);
    expect(aiMentions(dutiesOnlyCv)).toEqual([]);
    expect(
      aiMentions({ ...dutiesOnlyCv, unquantifiedClaims: [ev("Automated the weekly report")] })
    ).toEqual(["Automated the weekly report"]);
  });

  it("does not let 'email' or 'retail' count as AI", () => {
    const cv: ResumeExtraction = {
      skillGroups: [{ category: "x", skills: [ev("Email"), ev("Retail"), ev("Mailchimp")] }],
    };
    expect(aiMentions(cv)).toEqual([]);
    expect(cvChecksFor(cv).find((c) => c.questionId === "a1")?.cvScore).toBe(2);
  });

  it("reads AI mentions as regular use, never more", () => {
    expect(byId(resultsCv).a1.cvScore).toBe(3);
    expect(byId(resultsCv).a1.evidence).toContain("Power Automate");
  });
});

describe("reconciling answers against the CV", () => {
  it("flags an answer two or more rungs above what the CV shows", () => {
    const gaps = reconcile(dutiesOnlyCv, { o1: 4, p2: 1, sm1: 4, a1: 4 });
    const ids = gaps.map((g) => g.questionId);
    expect(ids).toEqual(["o1", "sm1", "a1"]);
    for (const g of gaps) {
      expect(g.direction).toBe("cv-lower");
      expect(g.selfScore - g.cvScore).toBeGreaterThanOrEqual(DISCREPANCY_THRESHOLD);
      expect(g.advice.length).toBeGreaterThan(20);
      expect(g.questionText).toBe(COMPASS_QUESTIONS.find((q) => q.id === g.questionId)?.questionText);
    }
  });

  it("flags underselling too", () => {
    const gaps = reconcile(resultsCv, { o1: 2, p2: 2, sm1: 4, a1: 1 });
    expect(gaps.map((g) => [g.questionId, g.direction])).toEqual([
      ["o1", "cv-higher"],
      ["p2", "cv-higher"],
      ["a1", "cv-higher"],
    ]);
    expect(gaps[0].advice).toContain("5 quantified results");
    expect(gaps[2].advice).toContain("Power Automate and ChatGPT");
  });

  it("treats a one-rung difference as noise", () => {
    expect(reconcile(dutiesOnlyCv, { o1: 2, p2: 2, sm1: 3, a1: 3 })).toEqual([]);
  });

  it("ignores questions that were not answered", () => {
    expect(reconcile(dutiesOnlyCv, { o1: 5 }).map((g) => g.questionId)).toEqual(["o1"]);
    expect(reconcile(dutiesOnlyCv, {})).toEqual([]);
  });

  it("uses the real option labels on both sides", () => {
    const [gap] = reconcile(dutiesOnlyCv, { o1: 4 });
    expect(gap.selfLabel).toBe("Mostly results");
    expect(gap.cvLabel).toBe("Duties only");
    expect(optionLabel("o1", 99)).toBe("99");
  });

  it("names the first screening problem in the advice", () => {
    const [gap] = reconcile(dutiesOnlyCv, { sm1: 5 });
    expect(gap.advice).toContain("No skills section");
  });
});

describe("formatting", () => {
  it("writes one traceable line per gap", () => {
    const lines = formatDiscrepancyLines(reconcile(dutiesOnlyCv, { o1: 4, a1: 5 }));
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatch(/^Offer \(o1\): rated themselves "Mostly results" \(4\/5\); CV reads "Duties only" \(1\/5\)\./);
    expect(lines[1]).toContain("AI Fluency (a1)");
  });

  it("ties the rewrites to the Offer answer", () => {
    expect(rewriteLinkLine({ o1: 2 })).toContain('"Mostly duties"');
    expect(rewriteLinkLine({ o1: 5 })).toMatch(/what that standard looks like/);
    expect(rewriteLinkLine({})).toBeNull();
    expect(rewriteLinkLine(null)).toBeNull();
  });
});
