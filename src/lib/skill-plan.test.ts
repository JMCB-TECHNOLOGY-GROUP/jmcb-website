import { describe, it, expect } from "vitest";
import { buildSkillPlan, formatSkillPlan, COURSES } from "./skill-plan";

describe("buildSkillPlan", () => {
  it("builds an evidence plan carrying the candidate's own before and after", () => {
    const [entry] = buildSkillPlan({
      weakRubric: ["evidence"],
      examples: { evidence: { before: "My part was the architecture.", after: "I owned the architecture and enrolment went from zero to 40K." } },
    });
    expect(entry.area).toBe("Evidence");
    expect(entry.before).toBe("My part was the architecture.");
    expect(entry.after).toContain("40K");
    expect(entry.skills.length).toBeGreaterThanOrEqual(2);
    expect(entry.courses[0]).toEqual(COURSES.interviewingUMD);
    expect(entry.drill).toMatch(/Ten minutes a day/);
    expect(entry.measure).toMatch(/4 or higher/);
  });

  it("maps target gaps to the right catalogue entry by keyword", () => {
    const plan = buildSkillPlan({
      missingForTarget: [
        "LLM, generative AI, prompt engineering or RAG architecture evidence",
        "Data science or MLOps tooling (Python, TensorFlow, PyTorch, Azure ML, Databricks)",
        "Any budget or revenue responsibility",
      ],
      max: 6,
    });
    expect(plan.map((p) => p.key)).toEqual(["gap-llm", "gap-ml", "gap-money"]);
    expect(plan[0].courses.map((c) => c.name)).toContain("Building with the Claude API");
    expect(plan[1].courses.map((c) => c.name)).toContain("Azure AI Fundamentals (AI-900) learning path");
    expect(plan[0].why).toMatch(/^The role expects LLM/);
  });

  it("falls back to an honest generic entry for an unrecognised gap", () => {
    const [entry] = buildSkillPlan({ missingForTarget: ["Experience with forklift certification"] });
    expect(entry.key).toBe("gap-other");
    expect(entry.area).toBe("Experience with forklift certification");
    expect(entry.courses[0].name).toContain("Proof of Work");
  });

  it("covers every compass dimension", () => {
    const dims = ["Clarity", "Offer", "Momentum", "Proof", "AI Fluency", "Signal", "Search Mechanics"] as const;
    const plan = buildSkillPlan({ weakDimensions: [...dims], max: 10 });
    expect(plan.map((p) => p.key)).toEqual([...dims]);
    for (const p of plan) {
      expect(p.courses.length).toBeGreaterThan(0);
      expect(p.drill.length).toBeGreaterThan(40);
      expect(`${p.why} ${p.drill} ${p.measure}`).not.toMatch(/[—–]/);
    }
  });

  it("deduplicates and caps at three by default", () => {
    const plan = buildSkillPlan({
      weakRubric: ["evidence", "evidence", "structure"],
      weakDimensions: ["Offer", "Proof"],
      missingForTarget: ["Python"],
    });
    expect(plan).toHaveLength(3);
    expect(plan.map((p) => p.key)).toEqual(["evidence", "structure", "Offer"]);
  });

  it("ignores unknown keys and empty gaps", () => {
    expect(buildSkillPlan({ weakRubric: ["charisma"], missingForTarget: ["", "  "] })).toEqual([]);
  });

  it("puts free courses with real prices in every entry", () => {
    for (const c of Object.values(COURSES)) {
      expect(c.url).toMatch(/^(https:\/\/|\/)/);
      expect(c.cost).toMatch(/Free|\$/);
    }
  });
});

describe("formatSkillPlan", () => {
  it("writes the plan as plain lines for notes and email", () => {
    const lines = formatSkillPlan(
      buildSkillPlan({ weakRubric: ["concision"], examples: { concision: { before: "long", after: "short" } } })
    );
    expect(lines[0]).toMatch(/^Concision: /);
    expect(lines).toContain("  Before: long");
    expect(lines).toContain("  After: short");
    expect(lines.find((l) => l.startsWith("  Courses: "))).toContain("Free to audit");
    expect(lines[lines.length - 1]).toMatch(/^  Done when: /);
  });
});
