// ============================================================
// src/lib/validation.ts — zod schemas for every public API boundary.
// Use `schema.safeParse(body)` in route handlers and return 400 on failure.
// ============================================================

import { z } from "zod";

const email = z.string().trim().email().max(254);
const shortText = z.string().trim().max(200);
const optionalShortText = shortText.optional().nullable();
const answers = z.record(z.string(), z.number().int().min(0).max(5));

export const contactSchema = z
  .object({
    name: shortText.min(1),
    email,
    organization: optionalShortText,
    message: z.string().trim().min(1).max(5000),
  })
  .passthrough();

export const leadSchema = z
  .object({
    firstName: shortText.min(1),
    lastName: shortText.min(1),
    email,
    organization: optionalShortText,
    role: optionalShortText,
    companySize: optionalShortText,
    phone: z.string().trim().max(40).optional().nullable(),
    score: z.number().int().min(0).max(100).optional().nullable(),
    band: shortText.optional().nullable(),
    answers: answers.optional().nullable(),
    dimensions: z.array(z.record(z.string(), z.unknown())).max(50).optional().nullable(),
  })
  .passthrough();

// Programme applications (/program). Free-tier intake, so the bar is low by
// design: enough to reach the applicant and to judge whether they have a real
// task to work on. Long-form answers are capped to keep notes readable.
export const programApplicationSchema = z
  .object({
    firstName: shortText.min(1),
    lastName: shortText.min(1),
    email,
    phone: z.string().trim().max(40).optional().nullable(),
    location: optionalShortText,
    organization: optionalShortText,
    role: optionalShortText,
    // The question the whole programme hangs on — every project attaches to
    // this task, so an application without one cannot be accepted.
    realTask: z.string().trim().min(20).max(2000),
    motivation: z.string().trim().max(2000).optional().nullable(),
    tier: z.enum(["core", "capstone_interest"]).default("core"),
    canAttend: z.boolean().default(false),
    referral: optionalShortText,
  })
  .passthrough();

// CV extraction (/api/career-assessment/resume). Either a base64 PDF or
// pasted text, never both required. The base64 cap mirrors MAX_RESUME_BYTES
// in lib/resume.ts once base64 inflation is accounted for, so an oversized
// upload is rejected here rather than at the model.
export const resumeExtractSchema = z
  .object({
    // Base64 of any accepted document type; the server picks the parser from
    // fileName, so fileName is required whenever fileBase64 is present.
    fileBase64: z.string().max(3_600_000).optional().nullable(),
    fileName: optionalShortText,
    text: z.string().trim().max(60_000).optional().nullable(),
    targetRole: optionalShortText,
    targetTitle: optionalShortText,
  })
  .refine((v) => Boolean(v.fileBase64 && v.fileName) || Boolean(v.text && v.text.length > 50), {
    message: "Provide a document, or at least 50 characters of CV text",
  });

// The extraction as it comes back from the client on final submit. Shapes are
// bounded because this lands in the leads notes column.
// Every claim carries the CV words that support it, because the server drops
// anything it cannot find in the source text (see lib/resume.ts).
const evidenced = z.object({
  value: z.string().trim().max(500),
  evidence: z.string().trim().max(1000),
});

const skillGroup = z.object({
  category: z.string().trim().max(80),
  skills: z.array(evidenced).max(40),
});

export const resumeExtractionSchema = z.object({
  currentTitle: z.string().trim().max(200).optional().nullable(),
  yearsExperience: z.number().int().min(0).max(70).optional().nullable(),
  industries: z.array(z.string().trim().max(120)).max(10).optional().nullable(),
  skillGroups: z.array(skillGroup).max(8).optional().nullable(),
  quantifiedAchievements: z.array(evidenced).max(10).optional().nullable(),
  unquantifiedClaims: z.array(evidenced).max(5).optional().nullable(),
  atsIssues: z.array(z.string().trim().max(500)).max(8).optional().nullable(),
  missingForTarget: z.array(z.string().trim().max(200)).max(10).optional().nullable(),
  education: z.array(z.string().trim().max(300)).max(8).optional().nullable(),
  summary: z.string().trim().max(2000).optional().nullable(),
});

// Career Compass submissions (/career-assessment). Two halves: `preferences`
// is the free-form capture of what the applicant wants from their next job,
// `answers` is the scored COMPASS set. Both are bounded so a scripted post
// can't stuff the leads table's notes column.
export const careerAssessmentSchema = z
  .object({
    firstName: shortText.min(1),
    lastName: shortText.min(1),
    email,
    phone: z.string().trim().max(40).optional().nullable(),
    location: optionalShortText,
    targetTitle: optionalShortText,
    // Preference ids map to PREFERENCE_FIELDS; values are option ids, or an
    // array of them for multi-select fields.
    preferences: z
      .record(z.string().max(60), z.union([z.string().max(60), z.array(z.string().max(60)).max(10)]))
      .refine((p) => Object.keys(p).length <= 30, "too many preference fields"),
    answers,
    score: z.number().int().min(0).max(100),
    band: shortText,
    dimensions: z.record(z.string().max(60), z.number()).optional().nullable(),
    complete: z.boolean().default(false),
    // Set from the applicant's own tick box on the results step — never
    // inferred server-side. Gates founding-cohort registration.
    joinFoundingCohort: z.boolean().default(false),
    // Present only when the applicant gave us a CV. resumePath is the private
    // storage object key, never a URL — signed URLs are minted server-side.
    resume: resumeExtractionSchema.optional().nullable(),
    resumePath: z.string().trim().max(300).optional().nullable(),
    utmSource: optionalShortText,
    utmMedium: optionalShortText,
    utmCampaign: optionalShortText,
  })
  .passthrough();

export const partialCompletionSchema = z
  .object({
    email,
    firstName: optionalShortText,
    lastName: optionalShortText,
    organization: optionalShortText,
    companySize: optionalShortText,
    role: optionalShortText,
    answersSoFar: answers.optional().nullable(),
    currentQuestion: z.number().int().min(1).max(50).optional().nullable(),
    utmSource: optionalShortText,
    utmMedium: optionalShortText,
    utmCampaign: optionalShortText,
  })
  .passthrough();

export const assessmentSubmitSchema = z
  .object({
    email,
    firstName: optionalShortText,
    lastName: optionalShortText,
    organization: optionalShortText,
    companySize: shortText.min(1),
    role: shortText.min(1),
    answers: answers.refine((a) => Object.keys(a).length > 0, "answers required"),
    utmSource: optionalShortText,
    utmMedium: optionalShortText,
    utmCampaign: optionalShortText,
  })
  .passthrough();

export const resumeTokenSchema = z.string().trim().min(8).max(200);

/** Flatten zod issues into a short, client-safe message. */
export function formatIssues(error: z.ZodError): string {
  return error.issues.map((i) => `${i.path.join(".") || "body"}: ${i.message}`).join("; ");
}
