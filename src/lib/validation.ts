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
