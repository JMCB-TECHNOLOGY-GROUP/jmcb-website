import { describe, it, expect } from "vitest";
import { scoreLeadQuality, shouldNotifyImmediately } from "./lead-scoring";

describe("scoreLeadQuality", () => {
  describe("hot leads", () => {
    it("scores C-suite at large company with 3+ weak dimensions as hot", () => {
      const result = scoreLeadQuality({
        role: "c-suite",
        companySize: "51-200",
        answers: {
          q1: 2, q2: 1, q3: 2, q4: 4, q5: 3,
          q6: 1, q7: 2, q8: 4, q9: 2, q10: 3,
        },
      });
      expect(result.score).toBe("hot");
      expect(result.urgencySignals).toContain("Executive-level decision maker");
    });

    it("scores VP at 200+ company with many gaps as hot", () => {
      const result = scoreLeadQuality({
        role: "vp",
        companySize: "200+",
        answers: {
          q1: 1, q2: 2, q3: 1, q4: 2, q5: 1,
          q6: 2, q7: 1, q8: 2, q9: 1, q10: 2,
        },
      });
      expect(result.score).toBe("hot");
    });

    it("scores business owner at large company with 3+ gaps as hot", () => {
      const result = scoreLeadQuality({
        role: "business-owner",
        companySize: "200+",
        answers: {
          q1: 1, q2: 2, q3: 1, q4: 3, q5: 2,
          q6: 1, q7: 3, q8: 2, q9: 1, q10: 3,
        },
      });
      expect(result.score).toBe("hot");
    });
  });

  describe("warm leads", () => {
    it("scores director with 2+ weak dimensions as warm", () => {
      const result = scoreLeadQuality({
        role: "director",
        companySize: "11-50",
        answers: {
          q1: 2, q2: 2, q3: 3, q4: 4, q5: 4,
          q6: 3, q7: 4, q8: 3, q9: 3, q10: 4,
        },
      });
      expect(result.score).toBe("warm");
    });

    it("scores any role at large company with 4+ gaps as warm", () => {
      const result = scoreLeadQuality({
        role: "individual-contributor",
        companySize: "200+",
        answers: {
          q1: 1, q2: 2, q3: 1, q4: 2, q5: 3,
          q6: 3, q7: 3, q8: 3, q9: 3, q10: 3,
        },
      });
      expect(result.score).toBe("warm");
    });
  });

  describe("cold leads", () => {
    it("scores individual contributor with strong scores as cold", () => {
      const result = scoreLeadQuality({
        role: "individual-contributor",
        companySize: "1-10",
        answers: {
          q1: 4, q2: 4, q3: 5, q4: 4, q5: 4,
          q6: 3, q7: 4, q8: 3, q9: 4, q10: 4,
        },
      });
      expect(result.score).toBe("cold");
    });

    it("scores student as cold", () => {
      const result = scoreLeadQuality({
        role: "student",
        companySize: "1-10",
        answers: {
          q1: 3, q2: 3, q3: 3, q4: 3, q5: 3,
          q6: 3, q7: 3, q8: 3, q9: 3, q10: 3,
        },
      });
      expect(result.score).toBe("cold");
      expect(result.reason).toContain("student");
    });

    it("scores high performers as cold due to low need", () => {
      const result = scoreLeadQuality({
        role: "manager",
        companySize: "11-50",
        answers: {
          q1: 4, q2: 5, q3: 4, q4: 5, q5: 4,
          q6: 4, q7: 5, q8: 4, q9: 5, q10: 4,
        },
      });
      expect(result.score).toBe("cold");
      expect(result.reason).toContain("advanced");
    });
  });

  describe("urgency signals", () => {
    it("includes low overall readiness signal when avg < 2.5", () => {
      const result = scoreLeadQuality({
        role: "c-suite",
        companySize: "200+",
        answers: { q1: 1, q2: 2, q3: 1, q4: 2, q5: 2 },
      });
      expect(result.urgencySignals).toContain(
        "Low overall readiness signals high need"
      );
    });

    it("tracks dimensionsBelowThree correctly", () => {
      const result = scoreLeadQuality({
        role: "consultant",
        companySize: "1-10",
        answers: { q1: 1, q2: 2, q3: 4, q4: 5, q5: 2 },
      });
      expect(result.dimensionsBelowThree).toBe(3);
    });
  });
});

describe("shouldNotifyImmediately", () => {
  it("returns true for hot leads", () => {
    expect(
      shouldNotifyImmediately({
        score: "hot",
        reason: "test",
        dimensionsBelowThree: 4,
        urgencySignals: [],
      })
    ).toBe(true);
  });

  it("returns false for warm leads", () => {
    expect(
      shouldNotifyImmediately({
        score: "warm",
        reason: "test",
        dimensionsBelowThree: 2,
        urgencySignals: [],
      })
    ).toBe(false);
  });

  it("returns false for cold leads", () => {
    expect(
      shouldNotifyImmediately({
        score: "cold",
        reason: "test",
        dimensionsBelowThree: 0,
        urgencySignals: [],
      })
    ).toBe(false);
  });
});
