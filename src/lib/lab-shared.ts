// ============================================================
// src/lib/lab-shared.ts — client-safe logic for the Proof of Work Lab:
// onboarding step definitions, route guidance, and progress calculation.
// Server-only helpers (tokens, Stripe, database) live in lib/lab.ts.
// ============================================================

import { ONBOARDING_STEPS, type OnboardingStep, type RouteKey } from "./lab-types";

// What the portal returns for a student. Never includes token_hash or
// admin_notes.
export interface LabStudentView {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  real_task: string | null;
  status: string;
  github_username: string | null;
  github_verified_at: string | null;
  intro: string | null;
  linkedin: string | null;
  target_role: string | null;
  role_postings: { url: string; title: string; company: string }[];
  role_skills: string | null;
  route: RouteKey | null;
  route_reason: string | null;
  paid_at: string | null;
  agreement_signed_at: string | null;
  address_request: string | null;
  jmcb_address: string | null;
}

export interface LabSubmissionView {
  id: string;
  week: number;
  track: string;
  url: string | null;
  body: string | null;
  feedback: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export const STEP_META: Record<OnboardingStep, { title: string; blurb: string }> = {
  github: {
    title: "Create your GitHub account",
    blurb:
      "Everything you build lives in a public GitHub repository, and your portfolio links to it. Sign up free at github.com with your personal email, then enter your username here.",
  },
  intro: {
    title: "Introduce yourself",
    blurb:
      "Four or five sentences to the cohort: who you are, the task you are bringing, and what you want to be doing in a year. Your classmates see this.",
  },
  target_role: {
    title: "Find your target role",
    blurb:
      "Name the job you are aiming for, then find three real, current postings for it. Note which skills show up in all three. That list steers everything you build.",
  },
  route: {
    title: "Choose your certification route",
    blurb:
      "Microsoft Power Platform Developer (AB-400, which replaces PL-400 from 16 October) or Claude Certified Architect. Answer the five questions and pick the one that fits your target role.",
  },
  payment: {
    title: "Pay the certification track fee",
    blurb:
      "The fee covers your route's study plan, coaching sessions and exam preparation. The exam fee itself is paid separately, to the exam provider, when you book.",
  },
  agreement: {
    title: "Accept the JMCB Associate terms",
    blurb:
      "Your capstone builds are real JMCB project work. These terms cover confidentiality, ownership and how the arrangement ends.",
  },
  jmcb_address: {
    title: "Get your jmcbtech.com address",
    blurb:
      "Issued for your JMCB project work, and used to register for your exam. Request the name you would like; Jermaine issues it.",
  },
};

export const ROUTES: Record<RouteKey, { name: string; exam: string; fits: string; examFee: string }> = {
  pl400: {
    name: "Microsoft Power Platform Developer",
    exam: "AB-400",
    fits: "Roles inside organisations that run on Microsoft 365, Dynamics 365 or Power Apps: business applications developer, Power Platform developer, CRM analyst, automation specialist.",
    examFee: "About US$165 (varies by country), paid to Microsoft when you book. AB-400 replaces PL-400 from 16 Oct 2026",
  },
  claude_arch: {
    name: "Claude Certified Architect, Foundations",
    exam: "CCAR-F",
    fits: "Roles designing AI systems: AI solutions architect, AI engineer, automation lead, technical consultant building with Claude, agents and MCP.",
    examFee: "$125, paid to Anthropic when you book",
  },
};

// Route-choice questions. Each answer leans toward one route; the student
// still makes the final call.
export const ROUTE_QUESTIONS: {
  q: string;
  options: { label: string; lean: RouteKey }[];
}[] = [
  {
    q: "Where does your target employer's work mostly live?",
    options: [
      { label: "Microsoft 365, Teams, SharePoint, Dynamics", lean: "pl400" },
      { label: "Mixed tools, custom software, or a start-up stack", lean: "claude_arch" },
    ],
  },
  {
    q: "Which job titles did your three postings use?",
    options: [
      { label: "Power Platform / Dynamics / business applications", lean: "pl400" },
      { label: "AI engineer, AI architect, automation, solutions", lean: "claude_arch" },
    ],
  },
  {
    q: "How do you like to build?",
    options: [
      { label: "Microsoft tools, and I am ready to write real code (C#, TypeScript)", lean: "pl400" },
      { label: "Designing prompts, agents and how systems fit together", lean: "claude_arch" },
    ],
  },
  {
    q: "Your week-1 task is closest to:",
    options: [
      { label: "Forms, approvals, records, data in lists or tables", lean: "pl400" },
      { label: "Writing, research, summarising, deciding from documents", lean: "claude_arch" },
    ],
  },
  {
    q: "In a year, you would rather be known as:",
    options: [
      { label: "The person who builds the business apps", lean: "pl400" },
      { label: "The person who designs how AI is used", lean: "claude_arch" },
    ],
  },
];

export function recommendRoute(answers: (RouteKey | null)[]): RouteKey | null {
  const pl = answers.filter((a) => a === "pl400").length;
  const cl = answers.filter((a) => a === "claude_arch").length;
  if (pl + cl < ROUTE_QUESTIONS.length) return null;
  return pl > cl ? "pl400" : "claude_arch";
}

// Plain-language associate terms. DRAFT for Jermaine's review: see
// docs/lab/workflow.md.
export const ASSOCIATE_TERMS = [
  "Scope: you work on JMCB project builds agreed with Jermaine, starting with your cohort capstone. Any paid work is agreed separately, in writing, before it starts.",
  "Your jmcbtech.com address is for JMCB work and your exam registration only, not personal use or other businesses.",
  "Confidentiality: client names, data and materials you see through JMCB stay confidential, during and after the arrangement.",
  "Ownership: your cohort portfolio is yours to publish. Work built for a JMCB client belongs to JMCB or the client, and you may describe it without confidential detail.",
  "Ending it: either side can end the arrangement by email at any time. The jmcbtech.com address is closed within 7 days of the end.",
];

export function isStepDone(s: LabStudentView, step: OnboardingStep): boolean {
  switch (step) {
    case "github":
      return Boolean(s.github_verified_at);
    case "intro":
      return Boolean(s.intro);
    case "target_role":
      return Boolean(s.target_role) && s.role_postings.length >= 3 && Boolean(s.role_skills);
    case "route":
      return Boolean(s.route);
    case "payment":
      return Boolean(s.paid_at);
    case "agreement":
      return Boolean(s.agreement_signed_at);
    case "jmcb_address":
      return Boolean(s.jmcb_address);
  }
}

export function progress(s: LabStudentView): { done: number; total: number; next: OnboardingStep | null } {
  const done = ONBOARDING_STEPS.filter((st) => isStepDone(s, st)).length;
  const next = ONBOARDING_STEPS.find((st) => !isStepDone(s, st)) ?? null;
  return { done, total: ONBOARDING_STEPS.length, next };
}
