import { describe, it, expect } from "vitest";
import {
  MAX_RESUME_BYTES,
  validateResumeFile,
  flattenSkills,
  normalizeExtraction,
  buildExtractionPrompt,
  appearsInSource,
  numbersIn,
  figuresAreGrounded,
  verifyExtraction,
  verifyRewrites,
} from "./resume";
import { kindForFileName, normalizeWhitespace } from "./document-formats";

const file = (over: Partial<{ type: string; size: number; name: string }> = {}) => ({
  type: "application/pdf",
  size: 120_000,
  name: "cv.pdf",
  ...over,
});

const CV = `Jane Doe
Operations Manager, Riverside Health, 2018 to 2026
Cut rota conflicts by 60% and saved four hours a week.
Managed a team of 12 across three sites.
Skills: Excel, Power BI, rota planning, invoice reconciliation.`;

describe("accepted formats", () => {
  it.each([
    ["cv.pdf", "pdf"],
    ["cv.docx", "docx"],
    ["cv.doc", "doc"],
    ["cv.odt", "odt"],
    ["cv.rtf", "rtf"],
    ["cv.txt", "text"],
    ["CV.DOCX", "docx"],
  ])("recognises %s", (name, kind) => {
    expect(kindForFileName(name)).toBe(kind);
  });

  it("refuses formats we cannot read", () => {
    expect(kindForFileName("cv.pages")).toBeNull();
    expect(kindForFileName("cv.png")).toBeNull();
    expect(validateResumeFile(file({ name: "cv.png" }))).toMatch(/PDF, Word/);
  });

  it("accepts every supported document type", () => {
    for (const name of ["cv.pdf", "cv.docx", "cv.doc", "cv.odt", "cv.rtf", "cv.txt"]) {
      expect(validateResumeFile(file({ name })), name).toBeNull();
    }
  });

  it("rejects files over the request-body ceiling", () => {
    expect(validateResumeFile(file({ size: MAX_RESUME_BYTES + 1 }))).toMatch(/2\.5MB/);
  });

  it("rejects an empty file", () => {
    expect(validateResumeFile(file({ size: 0 }))).toMatch(/empty/i);
  });

  it("keeps the ceiling under the 4.5MB serverless body limit once base64-inflated", () => {
    expect((MAX_RESUME_BYTES * 4) / 3).toBeLessThan(4.5 * 1024 * 1024);
  });
});

describe("source matching", () => {
  it("matches an exact quote", () => {
    expect(appearsInSource("Cut rota conflicts by 60%", CV)).toBe(true);
  });

  it("matches through differing punctuation and spacing", () => {
    expect(appearsInSource("cut  rota   conflicts by 60%!", CV)).toBe(true);
  });

  it("matches a long quote via a five-word window when the tail differs", () => {
    expect(appearsInSource("Managed a team of 12 across four sites", CV)).toBe(true);
  });

  it("rejects an invented sentence", () => {
    expect(appearsInSource("Led a digital transformation programme", CV)).toBe(false);
  });

  it("rejects a short phrase that is not present", () => {
    expect(appearsInSource("Kubernetes", CV)).toBe(false);
  });

  it("rejects empty input rather than matching everything", () => {
    expect(appearsInSource("", CV)).toBe(false);
    expect(appearsInSource("Excel", "")).toBe(false);
  });
});

describe("figure grounding", () => {
  it("finds numbers including decimals and thousands separators", () => {
    expect(numbersIn("saved 1,200 hours and 3.5 days")).toEqual(["1200", "3.5"]);
  });

  it("allows figures already in the CV", () => {
    expect(figuresAreGrounded("Cut rota conflicts by 60%", CV)).toBe(true);
  });

  it("blocks a figure the CV never stated", () => {
    expect(figuresAreGrounded("Cut rota conflicts by 85%", CV)).toBe(false);
  });

  it("allows placeholders, which carry no digits", () => {
    expect(figuresAreGrounded("Cut rota conflicts by [X]%", CV)).toBe(true);
  });
});

describe("verifyExtraction", () => {
  const extraction = normalizeExtraction({
    skillGroups: [
      {
        category: "Tools",
        skills: [
          { value: "Excel", evidence: "Skills: Excel, Power BI" },
          { value: "Kubernetes", evidence: "Skills: Kubernetes" }, // invented
        ],
      },
    ],
    quantifiedAchievements: [
      { value: "Cut rota conflicts by 60%", evidence: "Cut rota conflicts by 60%" },
      { value: "Grew revenue by 200%", evidence: "Grew revenue by 200% year on year" }, // invented
    ],
    unquantifiedClaims: [{ value: "Managed a team", evidence: "Managed a team of 12 across three sites" }],
  });

  const { verified, report } = verifyExtraction(extraction, CV);

  it("keeps skills the CV evidences", () => {
    expect(flattenSkills(verified)).toEqual(["Excel"]);
  });

  it("drops a skill the CV never mentions", () => {
    expect(flattenSkills(verified)).not.toContain("Kubernetes");
    expect(report.skillsDropped).toBe(1);
  });

  it("drops an achievement whose evidence is not in the CV", () => {
    expect(verified.quantifiedAchievements?.map((a) => a.value)).toEqual([
      "Cut rota conflicts by 60%",
    ]);
    expect(report.achievementsDropped).toBeGreaterThan(0);
  });

  it("keeps a grounded unquantified claim", () => {
    expect(verified.unquantifiedClaims).toHaveLength(1);
  });

  it("removes whole groups left empty by verification", () => {
    const { verified: v } = verifyExtraction(
      normalizeExtraction({
        skillGroups: [{ category: "Made up", skills: [{ value: "Kubernetes", evidence: "x" }] }],
      }),
      CV
    );
    expect(v.skillGroups).toEqual([]);
  });

  it("reports counts that add up to what it was given", () => {
    expect(report.skillsKept + report.skillsDropped).toBe(2);
  });
});

describe("verifyRewrites", () => {
  it("keeps a rewrite grounded in the CV that adds no new figure", () => {
    const { kept, dropped } = verifyRewrites(
      [{ before: "Managed a team of 12 across three sites", after: "Managed 12 staff across 3 sites", note: "n" }],
      CV
    );
    expect(kept).toHaveLength(1);
    expect(dropped).toBe(0);
  });

  it("drops a rewrite whose original is not in the CV", () => {
    const { kept, dropped } = verifyRewrites(
      [{ before: "Led a transformation programme", after: "Led it well", note: "n" }],
      CV
    );
    expect(kept).toHaveLength(0);
    expect(dropped).toBe(1);
  });

  it("drops a rewrite that invents a figure", () => {
    const { kept } = verifyRewrites(
      [{ before: "Managed a team of 12 across three sites", after: "Managed 12 staff, cutting costs 40%", note: "n" }],
      CV
    );
    expect(kept).toHaveLength(0);
  });

  it("keeps a rewrite that uses a placeholder instead of inventing", () => {
    const { kept } = verifyRewrites(
      [{ before: "Managed a team of 12 across three sites", after: "Managed 12 staff, cutting costs [X]%", note: "n" }],
      CV
    );
    expect(kept).toHaveLength(1);
  });

  it("handles a missing or malformed list", () => {
    expect(verifyRewrites(undefined, CV).kept).toEqual([]);
    expect(verifyRewrites([{ before: "x" } as never], CV).kept).toEqual([]);
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

  it("drops evidenced entries with no value", () => {
    const r = normalizeExtraction({
      skillGroups: [{ category: "X", skills: [{ value: "", evidence: "y" }, { value: "SQL", evidence: "z" }] }],
    });
    expect(r.skillGroups?.[0].skills).toHaveLength(1);
  });

  it("rejects implausible years of experience", () => {
    expect(normalizeExtraction({ yearsExperience: 200 }).yearsExperience).toBeUndefined();
    expect(normalizeExtraction({ yearsExperience: 0 }).yearsExperience).toBeUndefined();
    expect(normalizeExtraction({ yearsExperience: 7.4 }).yearsExperience).toBe(7);
  });

  it("caps runaway arrays", () => {
    const many = Array.from({ length: 100 }, (_, i) => ({ value: `s-${i}`, evidence: "e" }));
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

  it("demands verbatim evidence and forbids invented numbers", () => {
    const p = buildExtractionPrompt();
    expect(p).toMatch(/VERBATIM/);
    expect(p).toMatch(/Never state a number that is not in the CV/);
  });
});

describe("whitespace normalisation", () => {
  it("collapses the line-break noise that PDF renderers produce", () => {
    expect(normalizeWhitespace("a  \r\n\r\n\r\n  b   c")).toBe("a\n\nb c");
  });
});
