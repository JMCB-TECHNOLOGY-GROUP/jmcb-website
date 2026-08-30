// ============================================================
// src/lib/resume.ts — CV capture and skill extraction for Career Compass.
//
// Why this exists: the assessment asks what someone WANTS. Their CV is the
// only place that says what they already HAVE. Together they give us the two
// halves we need to reformat the CV and aim the training at real gaps.
//
// Accepted input is deliberately narrow:
//   - PDF, read natively by the Messages API as a document block, so we take
//     on no PDF-parsing dependency.
//   - Pasted plain text, for anyone whose CV is in Word or Google Docs.
// DOCX is intentionally NOT accepted — it would mean adding a parser
// dependency. The UI tells those users to paste or export a PDF.
// ============================================================

/**
 * Vercel caps a serverless request body at 4.5MB and base64 inflates by ~4/3,
 * so the raw file ceiling has to sit well under that. 2.5MB is far above any
 * real CV (they are almost always under 500KB).
 */
export const MAX_RESUME_BYTES = 2.5 * 1024 * 1024;
export const MAX_RESUME_TEXT = 60_000;

export const ACCEPTED_MIME = ["application/pdf"] as const;
export const ACCEPTED_EXTENSIONS = ".pdf";

export type SkillGroup = {
  category: string;
  skills: string[];
};

/** The structured read of a CV. Every field is optional — a sparse or badly
 *  formatted CV must still produce something usable rather than an error. */
export type ResumeExtraction = {
  currentTitle?: string;
  yearsExperience?: number;
  industries?: string[];
  /** Grouped so the UI can render them as labelled chip rows. */
  skillGroups?: SkillGroup[];
  /** Achievements that already carry a number — the ones worth leading with. */
  quantifiedAchievements?: string[];
  /** Claims with no evidence behind them, which is what we help them fix. */
  unquantifiedClaims?: string[];
  /** Concrete problems that would cost them screening passes. */
  atsIssues?: string[];
  /** Skills their stated target role expects that the CV does not evidence. */
  missingForTarget?: string[];
  education?: string[];
  summary?: string;
};

export type ResumeSource = "pdf" | "text";

/**
 * Flattens the grouped skills for storage, email and prompt reuse.
 *
 * Takes a structural type rather than ResumeExtraction because the zod-parsed
 * payload models absent fields as `null`, which is not assignable to the
 * `undefined` in ResumeExtraction. Only skillGroups is actually read.
 */
export function flattenSkills(
  extraction:
    | { skillGroups?: { category?: string; skills?: string[] | null }[] | null }
    | null
    | undefined
): string[] {
  if (!extraction?.skillGroups) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const group of extraction.skillGroups) {
    for (const skill of group.skills ?? []) {
      const key = skill.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(skill.trim());
    }
  }
  return out;
}

/** Rejects anything we cannot read before it reaches the model. */
export function validateResumeFile(file: { type: string; size: number; name: string }): string | null {
  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    return file.name.toLowerCase().endsWith(".docx") || file.name.toLowerCase().endsWith(".doc")
      ? "Word files aren't supported yet. Export it as a PDF, or paste the text instead."
      : "Please upload a PDF, or paste the text instead.";
  }
  if (file.size > MAX_RESUME_BYTES) {
    return `That file is ${(file.size / 1024 / 1024).toFixed(1)}MB. Please keep it under 2.5MB.`;
  }
  if (file.size === 0) return "That file looks empty.";
  return null;
}

/**
 * The extraction instruction. Kept here rather than inline in the route so the
 * prompt is reviewable next to the type it has to satisfy.
 */
export function buildExtractionPrompt(targetRole?: string, targetTitle?: string): string {
  const target = [targetTitle, targetRole].filter(Boolean).join(" / ");
  return `You are reading a job seeker's CV to pull out what they can actually evidence.

${target ? `The role they are targeting: ${target}. Judge the CV against that target.` : "They have not named a target role, so judge the CV on its own terms."}

Extract, honestly and without inflating anything:

- currentTitle: their most recent job title, as written.
- yearsExperience: a single integer, your best estimate of total professional years.
- industries: the sectors they have actually worked in.
- skillGroups: their real skills, grouped under short category names you choose to fit this person (for example "Tools and software", "Data and analysis", "Clinical", "Leadership"). Only skills the CV genuinely evidences. Do not pad the list with things that merely appear as a job requirement.
- quantifiedAchievements: achievements that already carry a number or a measurable outcome, quoted close to how they wrote them.
- unquantifiedClaims: up to five statements that claim value but carry no evidence, which they should put a number against.
- atsIssues: concrete, specific problems that would cost them automated screening or a six second human scan. Not generic advice. Things like a missing skills section, dates that do not line up, a two page summary before any achievement, tables or graphics a parser will mangle, no job title match to the target.
- missingForTarget: skills or evidence the target role expects that this CV does not show.${target ? "" : " Return an empty array if no target was given."}
- education: qualifications and institutions.
- summary: two sentences describing what this person is, in plain language, as a hiring manager would summarise them.

Rules: no em dashes or en dashes. Be specific to THIS CV. If the document is not a CV at all, return empty arrays and set summary to explain what it is instead.

Respond ONLY with JSON in this exact shape, no prose around it:
{"currentTitle":"","yearsExperience":0,"industries":[],"skillGroups":[{"category":"","skills":[]}],"quantifiedAchievements":[],"unquantifiedClaims":[],"atsIssues":[],"missingForTarget":[],"education":[],"summary":""}`;
}

/** Defensive coercion — the model is instructed to return this shape, but a
 *  malformed field must degrade to empty rather than crash the results page. */
export function normalizeExtraction(raw: unknown): ResumeExtraction {
  const o = (raw ?? {}) as Record<string, unknown>;
  const strArray = (v: unknown, cap = 20): string[] =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "").slice(0, cap) : [];

  const groups: SkillGroup[] = Array.isArray(o.skillGroups)
    ? (o.skillGroups as unknown[])
        .map((g) => {
          const gg = (g ?? {}) as Record<string, unknown>;
          return {
            category: typeof gg.category === "string" ? gg.category : "Skills",
            skills: strArray(gg.skills, 40),
          };
        })
        .filter((g) => g.skills.length > 0)
        .slice(0, 8)
    : [];

  const years = Number(o.yearsExperience);

  return {
    currentTitle: typeof o.currentTitle === "string" ? o.currentTitle : undefined,
    yearsExperience: Number.isFinite(years) && years >= 0 && years < 70 ? Math.round(years) : undefined,
    industries: strArray(o.industries, 10),
    skillGroups: groups,
    quantifiedAchievements: strArray(o.quantifiedAchievements, 10),
    unquantifiedClaims: strArray(o.unquantifiedClaims, 5),
    atsIssues: strArray(o.atsIssues, 8),
    missingForTarget: strArray(o.missingForTarget, 10),
    education: strArray(o.education, 8),
    summary: typeof o.summary === "string" ? o.summary : undefined,
  };
}
