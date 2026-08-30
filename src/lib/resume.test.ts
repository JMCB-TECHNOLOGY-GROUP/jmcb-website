import { describe, it, expect } from "vitest";
import {
  MAX_RESUME_BYTES,
  validateResumeFile,
  flattenSkills,
  normalizeExtraction,
  buildExtractionPrompt,
} from "./resume";

const pdf = (over: Partial<{ type: string; size: number; name: string }> = {}) => ({
  type: "application/pdf",
  size: 120_000,
  name: "cv.pdf",
  ...over,
});

describe("file validation", () => {
  it("accepts a normal PDF", () => {
    expect(validateResumeFile(pdf())).toBeNull();
  });

  it("accepts a PDF whose mime type is missing but extension is right", () => {
    expect(validateResumeFile(pdf({ type: "" }))).toBeNull();
  });

  it("tells Word users what to do instead of just refusing", () => {
    const msg = validateResumeFile(pdf({ type: "", name: "cv.docx" }));
    expect(msg).toMatch(/export it as a PDF|paste/i);
  });

  it("rejects other file types", () => {
    expect(validateResumeFile(pdf({ type: "image/png", name: "cv.png" }))).toMatch(/PDF/);
  });

  it("rejects files over the request-body ceiling", () => {
    expect(validateResumeFile(pdf({ size: MAX_RESUME_BYTES + 1 }))).toMatch(/2\.5MB/);
  });

  it("rejects an empty file", () => {
    expect(validateResumeFile(pdf({ size: 0 }))).toMatch(/empty/i);
  });

  it("keeps the ceiling under the 4.5MB serverless body limit once base64-inflated", () => {
    expect((MAX_RESUME_BYTES * 4) / 3).toBeLessThan(4.5 * 1024 * 1024);
  });
});

describe("flattenSkills", () => {
  it("flattens groups and drops duplicates case-insensitively", () => {
    expect(
      flattenSkills({
        skillGroups: [
          { category: "A", skills: ["Excel", "SQL"] },
          { category: "B", skills: ["excel", " Power BI "] },
        ],
      })
    ).toEqual(["Excel", "SQL", "Power BI"]);
  });

  it("returns an empty list for missing or empty input", () => {
    expect(flattenSkills(null)).toEqual([]);
    expect(flattenSkills({})).toEqual([]);
  });
});

describe("normalizeExtraction", () => {
  it("survives a completely malformed payload", () => {
    const r = normalizeExtraction({ skillGroups: "nope", industries: 42, yearsExperience: "abc" });
    expect(r.skillGroups).toEqual([]);
    expect(r.industries).toEqual([]);
    expect(r.yearsExperience).toBeUndefined();
  });

  it("survives null and undefined", () => {
    expect(normalizeExtraction(null).skillGroups).toEqual([]);
    expect(normalizeExtraction(undefined).industries).toEqual([]);
  });

  it("drops skill groups that carry no skills", () => {
    const r = normalizeExtraction({
      skillGroups: [{ category: "Empty", skills: [] }, { category: "Real", skills: ["SQL"] }],
    });
    expect(r.skillGroups).toHaveLength(1);
    expect(r.skillGroups?.[0].category).toBe("Real");
  });

  it("rejects implausible years of experience", () => {
    expect(normalizeExtraction({ yearsExperience: 200 }).yearsExperience).toBeUndefined();
    expect(normalizeExtraction({ yearsExperience: -3 }).yearsExperience).toBeUndefined();
    expect(normalizeExtraction({ yearsExperience: 7.4 }).yearsExperience).toBe(7);
  });

  it("filters non-string entries out of string arrays", () => {
    expect(normalizeExtraction({ industries: ["Health", 5, null, "  "] }).industries).toEqual(["Health"]);
  });

  it("caps runaway arrays", () => {
    const many = Array.from({ length: 100 }, (_, i) => `skill-${i}`);
    const r = normalizeExtraction({ skillGroups: [{ category: "X", skills: many }] });
    expect(r.skillGroups?.[0].skills.length).toBeLessThanOrEqual(40);
  });
});

describe("extraction prompt", () => {
  it("tells the model to judge against the target when one is known", () => {
    const p = buildExtractionPrompt("data-analyst", "Operations Analyst");
    expect(p).toContain("Operations Analyst");
    expect(p).toMatch(/Judge the CV against that target/);
  });

  it("handles a missing target without leaving a dangling label", () => {
    const p = buildExtractionPrompt();
    expect(p).toMatch(/have not named a target role/);
    expect(p).not.toMatch(/undefined/);
  });

  it("asks for the exact JSON keys the type declares", () => {
    const p = buildExtractionPrompt();
    for (const key of ["skillGroups", "atsIssues", "quantifiedAchievements", "missingForTarget"]) {
      expect(p).toContain(key);
    }
  });
});
