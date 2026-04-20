import { describe, it, expect } from "vitest";
import {
  ASSESSMENT_QUESTIONS,
  ASCEND_PHASES,
  DIMENSION_SERVICE_MAP,
  REPORT_BRANDING,
  getQuestionsForSize,
  calculateOverallScore,
  generateMicroInsight,
} from "./assessment-content";

describe("getQuestionsForSize", () => {
  it("returns 10 questions for small business (1-10)", () => {
    const questions = getQuestionsForSize("1-10");
    expect(questions.length).toBe(10);
    // Should include small business alternatives, not enterprise versions
    const ids = questions.map((q) => q.id);
    expect(ids).toContain("q6-governance-small");
    expect(ids).not.toContain("q6-governance-enterprise");
    expect(ids).toContain("q8-budget-small");
    expect(ids).not.toContain("q8-budget-enterprise");
  });

  it("returns 10 questions for enterprise (200+)", () => {
    const questions = getQuestionsForSize("200+");
    expect(questions.length).toBe(10);
    const ids = questions.map((q) => q.id);
    expect(ids).toContain("q6-governance-enterprise");
    expect(ids).not.toContain("q6-governance-small");
    expect(ids).toContain("q8-budget-enterprise");
    expect(ids).not.toContain("q8-budget-small");
  });

  it("returns 10 questions for mid-size (11-50)", () => {
    const questions = getQuestionsForSize("11-50");
    expect(questions.length).toBe(10);
  });

  it("all returned questions have 5 answer options", () => {
    const questions = getQuestionsForSize("51-200");
    questions.forEach((q) => {
      expect(q.options).toHaveLength(5);
      expect(q.options[0].value).toBe(1);
      expect(q.options[4].value).toBe(5);
    });
  });
});

describe("calculateOverallScore", () => {
  it("returns 0 for empty answers", () => {
    expect(calculateOverallScore({})).toBe(0);
  });

  it("returns 100 for all 5s", () => {
    const answers = { q1: 5, q2: 5, q3: 5, q4: 5, q5: 5 };
    expect(calculateOverallScore(answers)).toBe(100);
  });

  it("returns 20 for all 1s", () => {
    const answers = { q1: 1, q2: 1, q3: 1, q4: 1, q5: 1 };
    expect(calculateOverallScore(answers)).toBe(20);
  });

  it("returns 60 for all 3s (midpoint)", () => {
    const answers = { q1: 3, q2: 3, q3: 3, q4: 3, q5: 3 };
    expect(calculateOverallScore(answers)).toBe(60);
  });

  it("rounds to nearest integer", () => {
    // avg of (3+4) = 3.5, 3.5/5 = 0.7, *100 = 70
    const answers = { q1: 3, q2: 4 };
    expect(calculateOverallScore(answers)).toBe(70);
  });
});

describe("generateMicroInsight", () => {
  it("generates insight text with score and benchmark", () => {
    const question = ASSESSMENT_QUESTIONS[0]; // Data Foundation
    const insight = generateMicroInsight(question, 3, "11-50");
    expect(insight).toContain("3/5");
    expect(insight).toContain("Data Foundation");
  });

  it("replaces all template variables", () => {
    const question = ASSESSMENT_QUESTIONS[0];
    const insight = generateMicroInsight(question, 4, "200+");
    // Should not contain any unreplaced template variables
    expect(insight).not.toContain("{{");
    expect(insight).not.toContain("}}");
  });

  it("uses correct size label for small businesses", () => {
    const question = ASSESSMENT_QUESTIONS[2]; // Team AI Literacy
    const insight = generateMicroInsight(question, 2, "1-10");
    expect(insight).toContain("small business");
  });
});

describe("ASCEND_PHASES", () => {
  it("has all 6 ASCEND phases", () => {
    const phases = Object.keys(ASCEND_PHASES);
    expect(phases).toEqual([
      "Assess",
      "Strategize",
      "Construct",
      "Execute",
      "Normalize",
      "Develop",
    ]);
  });

  it("each phase has name, description, and color", () => {
    Object.values(ASCEND_PHASES).forEach((phase) => {
      expect(phase.name).toBeTruthy();
      expect(phase.description).toBeTruthy();
      expect(phase.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});

describe("DIMENSION_SERVICE_MAP", () => {
  it("maps all assessment dimensions to services", () => {
    const dimensions = [
      "Data Foundation",
      "AI Strategy & Vision",
      "Team AI Literacy",
      "Process Automation",
      "Technology Infrastructure",
      "AI Governance",
      "AI Usage & Risk",
      "Leadership Alignment",
      "AI Investment",
      "Use Case Clarity",
      "AI Culture & Change",
    ];
    dimensions.forEach((dim) => {
      expect(DIMENSION_SERVICE_MAP[dim]).toBeDefined();
      expect(DIMENSION_SERVICE_MAP[dim].service).toBeTruthy();
      expect(DIMENSION_SERVICE_MAP[dim].deliverable).toBeTruthy();
    });
  });
});

describe("REPORT_BRANDING", () => {
  it("has branding for all company sizes", () => {
    expect(REPORT_BRANDING["1-10"].title).toContain("Small Business");
    expect(REPORT_BRANDING["200+"].title).toContain("Enterprise");
  });
});
