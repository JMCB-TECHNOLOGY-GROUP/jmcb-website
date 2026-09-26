// ============================================================
// src/lib/lab-actions.ts — validation for student portal actions
// (POST /api/lab/[token]). Every rule carries its own message, written for the
// student, because the portal shows the first failure verbatim.
// ============================================================

import { z } from "zod";
import { TIMEZONES } from "./certification";

const text = (max: number, label: string) =>
  z.string({ error: `${label} is required.` }).trim().max(max, `${label} is too long (${max} characters at most).`);

const url = (label: string) =>
  z.string({ error: `${label} is required.` }).trim().url(`${label} must be a full link starting with https://`).max(1000);

export const LAB_ACTIONS = {
  contact: z.object({
    phone: z
      .string({ error: "Your cell phone is required." })
      .trim()
      .min(7, "Enter your full cell phone number, including the area code.")
      .max(40, "That phone number is too long.")
      .regex(/^[+()\d\s.-]+$/, "Phone can contain digits, spaces, +, -, ( and ) only."),
    smsOk: z.boolean().default(false),
    preferredContact: z.enum(["text", "whatsapp", "call", "email"], { error: "Choose the best way to reach you." }),
    timezone: z.enum(TIMEZONES, { error: "Choose your time zone." }),
  }),
  github: z.object({
    username: z
      .string({ error: "Enter your GitHub username." })
      .trim()
      .regex(/^[A-Za-z0-9-]{1,39}$/, "GitHub usernames use letters, numbers and dashes only (no @ or spaces)."),
  }),
  intro: z.object({
    intro: text(1500, "Your introduction").min(40, "Your introduction needs a few sentences (at least 40 characters)."),
    linkedin: z.string().trim().max(300).optional().nullable(),
  }),
  target_role: z.object({
    targetRole: text(200, "Target role").min(2, "Name the role you are aiming for."),
    postings: z
      .array(
        z.object({
          url: url("Each posting link"),
          title: text(200, "Each posting's job title").min(1, "Add the job title for each posting."),
          company: text(200, "Each posting's company").min(1, "Add the company for each posting."),
        })
      )
      .min(3, "Add three job postings: a link, title and company for each.")
      .max(5),
    skills: text(1500, "Skills").min(10, "List the skills that appear across your three postings."),
  }),
  route: z.object({
    route: z.enum(["pl400", "claude_arch"], { error: "Choose a route." }),
    reason: text(1000, "Your reason").min(10, "Say in a sentence why you chose this route."),
  }),
  checkout: z.object({}),
  verify_payment: z.object({ sessionId: z.string().trim().max(200) }),
  agreement: z.object({
    signature: text(200, "Your name").min(3, "Type your full legal name to accept."),
  }),
  address_request: z.object({
    local: z
      .string({ error: "Enter the address you would like." })
      .trim()
      .regex(/^[a-z0-9._-]{2,64}$/i, "Use letters, numbers, dots or dashes only, e.g. first.last (no @jmcbtech.com)."),
  }),
  submit: z.object({
    week: z.number().int().min(1).max(8),
    track: z.enum(["core", "pl400", "claude_arch"]),
    url: url("The link").optional().nullable(),
    body: z.string().trim().max(5000, "Your write-up is too long (5,000 characters at most).").optional().nullable(),
  }),
} as const;

export type LabAction = keyof typeof LAB_ACTIONS;
export type LabActionInput<A extends LabAction> = z.infer<(typeof LAB_ACTIONS)[A]> & { action: A };
export type AnyLabAction = { [A in LabAction]: LabActionInput<A> }[LabAction];

// Pick the schema by action first, so the student sees the message for the
// field they got wrong rather than a generic union failure.
export function parseLabAction(body: unknown): { ok: true; data: AnyLabAction } | { ok: false; error: string } {
  const action = (body as { action?: unknown } | null)?.action;
  if (typeof action !== "string" || !(action in LAB_ACTIONS)) return { ok: false, error: "Unknown action." };
  const result = LAB_ACTIONS[action as LabAction].safeParse(body);
  if (!result.success) return { ok: false, error: result.error.issues[0]?.message || "Check your answers and try again." };
  return { ok: true, data: { ...(result.data as object), action } as AnyLabAction };
}
