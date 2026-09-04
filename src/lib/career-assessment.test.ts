import { describe, it, expect } from "vitest";
import {
  COMPASS_QUESTIONS,
  COMPASS_DIMENSIONS,
  PREFERENCE_FIELDS,
  BANDS,
  DIMENSION_ACTIONS,
  calculateOverallScore,
  calculateDimensionScores,
  getBand,
  isComplete,
  rankDimensions,
  getRoleMatch,
  type CompassDimension,
} from "./career-assessment";

const answersAll = (v: number) =>
  Object.fromEntries(COMPASS_QUESTIONS.map((q) => [q.id, v]));

describe("compass question set", () => {
  it("covers every dimension with a consistent 1-5 ladder", () => {
    for (const q of COMPASS_QUESTIONS) {
      expect(COMPASS_DIMENSIONS[q.dimension], `unknown dimension ${q.dimension}`).toBeDefined();
      expect(q.options.map((o) => o.value)).toEqual([1, 2, 3, 4, 5]);
      expect(q.helpText.length).toBeGreaterThan(40);
    }
  });

  it("uses unique question ids", () => {
    const ids = COMPASS_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every dimension an action a job seeker can start this week", () => {
    for (const dim of Object.keys(COMPASS_DIMENSIONS) as CompassDimension[]) {
      expect(DIMENSION_ACTIONS[dim], `no action for ${dim}`).toBeDefined();
      expect(DIMENSION_ACTIONS[dim].week1.length).toBeGreaterThan(30);
    }
  });
});

describe("preference capture", () => {
  it("uses unique field and option ids", () => {
    const ids = PREFERENCE_FIELDS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const f of PREFERENCE_FIELDS) {
      const vals = f.options.map((o) => o.value);
      expect(new Set(vals).size, `duplicate option in ${f.id}`).toBe(vals.length);
    }
  });

  it("caps multi-select fields so answers stay comparable", () => {
    for (const f of PREFERENCE_FIELDS.filter((x) => x.multi)) {
      expect(f.maxChoices, `${f.id} is multi with no cap`).toBeGreaterThan(0);
    }
  });
});

describe("scoring", () => {
  it("maps the bottom of the scale to 0 and the top to 100", () => {
    expect(calculateOverallScore(answersAll(1))).toBe(0);
    expect(calculateOverallScore(answersAll(5))).toBe(100);
    expect(calculateOverallScore(answersAll(3))).toBe(50);
  });

  it("returns 0 rather than NaN when nothing is answered", () => {
    expect(calculateOverallScore({})).toBe(0);
  });

  it("scores partial answer sets on what was answered", () => {
    expect(calculateOverallScore({ [COMPASS_QUESTIONS[0].id]: 5 })).toBe(100);
  });

  it("averages each dimension on the original 1-5 scale", () => {
    const scores = calculateDimensionScores(answersAll(4));
    for (const dim of Object.keys(COMPASS_DIMENSIONS) as CompassDimension[]) {
      expect(scores[dim]).toBe(4);
    }
  });

  it("ranks the weakest dimension first", () => {
    const answers = { ...answersAll(5), p1: 1, p2: 1 };
    expect(rankDimensions(calculateDimensionScores(answers))[0]).toBe("Proof");
  });

  it("only reports complete when every question is answered", () => {
    expect(isComplete(answersAll(3))).toBe(true);
    const partial = answersAll(3);
    delete partial[COMPASS_QUESTIONS[0].id];
    expect(isComplete(partial)).toBe(false);
  });
});

describe("bands", () => {
  it("covers the whole 0-100 range with no gaps", () => {
    for (let s = 0; s <= 100; s++) {
      expect(getBand(s), `no band for ${s}`).toBeDefined();
    }
  });

  it("is ordered strongest first so the first match wins", () => {
    const mins = BANDS.map((b) => b.min);
    expect([...mins].sort((a, b) => b - a)).toEqual(mins);
  });

  it("maps every band onto a value the leads table CHECK constraint allows", () => {
    for (const b of BANDS) {
      expect(["early", "developing", "advanced"]).toContain(b.legacy);
    }
  });

  it("picks the band at each boundary", () => {
    expect(getBand(85).id).toBe("competitive");
    expect(getBand(84).id).toBe("ready");
    expect(getBand(65).id).toBe("ready");
    expect(getBand(64).id).toBe("building");
    expect(getBand(40).id).toBe("building");
    expect(getBand(39).id).toBe("finding");
    expect(getBand(0).id).toBe("finding");
  });
});

describe("role match", () => {
  it("puts direction first when the applicant has no target", () => {
    const d = calculateDimensionScores(answersAll(5));
    expect(getRoleMatch("unsure", d, 100).verdict).toMatch(/Direction first/);
  });

  it("flags an AI-heavy target as a stretch when proof and fluency are low", () => {
    const d = calculateDimensionScores({ ...answersAll(4), a1: 1, a2: 1, p1: 1, p2: 1 });
    expect(getRoleMatch("ai-automation", d, 60).verdict).toMatch(/stretch/);
  });

  it("does not call a non-technical target a stretch on the same scores", () => {
    const d = calculateDimensionScores({ ...answersAll(4), a1: 1, a2: 1, p1: 1, p2: 1 });
    expect(getRoleMatch("admin", d, 60).verdict).not.toMatch(/stretch/);
  });

  it("confirms a realistic target for a strong profile", () => {
    const d = calculateDimensionScores(answersAll(5));
    expect(getRoleMatch("ai-automation", d, 100).verdict).toMatch(/realistic/);
  });

  it("always returns adjacent suggestions to fall back on", () => {
    const d = calculateDimensionScores(answersAll(3));
    for (const field of ["unsure", "ai-automation", "admin", undefined]) {
      expect(getRoleMatch(field, d, 50).adjacent.length).toBeGreaterThan(0);
    }
  });
});
