// ============================================================
// src/lib/certification.ts — single source of truth for the Claude
// certification track.
//
// Two paths share one intake form (/certification/intake):
//   - "sprint":    the paid Certification Sprint. The fee buys training and
//                  coaching. It never buys a jmcbtech.com address.
//   - "associate": JMCB Associates, by invitation only. They sign an associate
//                  agreement, do real JMCB work, and get a jmcbtech.com address
//                  for that work — which is what lets them register for the
//                  exam through JMCB's Claude Partner Network membership.
//
// Never sell or imply exam access through a mailbox. Anthropic certifies people
// *at* partner organisations; see docs/certification-track/workflow.md.
// ============================================================

export const TRACK_NAME = "Claude Certification Track";

export const SPRINT = {
  name: "Certification Sprint",
  weeks: 2,
  // Coaching access runs past the exam so a failed first attempt has support
  // through the 14-day retake wait.
  coachingMonths: 2,
} as const;

// Exams the track prepares for. Only these three count toward Claude Partner
// Network tiers; the Associate certification does not, so it is not offered.
export const EXAMS = [
  { value: "ccdv_f", label: "Claude Certified Developer, Foundations", fee: 125 },
  { value: "ccar_f", label: "Claude Certified Architect, Foundations", fee: 125 },
  { value: "not_sure", label: "Not sure yet — help me choose", fee: null },
] as const;

export type ExamValue = (typeof EXAMS)[number]["value"];

export const PATHS = [
  {
    value: "sprint",
    label: "Certification Sprint (paid)",
    desc: "Two weeks of structured prep and coaching toward one exam. Fee confirmed before you pay; nothing is charged by this form.",
  },
  {
    value: "associate",
    label: "JMCB Associate (by invitation)",
    desc: "Only if Jermaine has invited you. Includes an associate agreement, real project work and a jmcbtech.com address.",
  },
] as const;

export type PathValue = (typeof PATHS)[number]["value"];

export const TIMEZONES = [
  "ET (US Eastern)",
  "CT (US Central)",
  "MT (US Mountain)",
  "PT (US Pacific)",
  "Guyana / Caribbean (AST)",
  "UK (GMT/BST)",
  "Central Europe (CET)",
  "South Africa (SAST)",
  "West Africa (WAT)",
  "Other",
] as const;

export const CONTACT_METHODS = ["email", "text", "whatsapp", "call"] as const;

export const EXPERIENCE_LEVELS = [
  { value: "none", label: "New to building with AI" },
  { value: "some", label: "I use Claude or ChatGPT regularly, little or no code" },
  { value: "builder", label: "I write code or have built with an AI API" },
  { value: "professional", label: "I build software professionally" },
] as const;

export function examLabel(value: string): string {
  return EXAMS.find((e) => e.value === value)?.label ?? value;
}
