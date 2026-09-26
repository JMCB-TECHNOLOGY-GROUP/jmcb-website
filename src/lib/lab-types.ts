// ============================================================
// src/lib/lab-types.ts — shared types for the Proof of Work Lab (the cohort
// LMS at /lab/[token] and /admin/lab). Client-safe: no server imports.
// ============================================================

// "core" is the Thursday Proof of Work session everyone attends. The two
// routes are the certification specialisations a student chooses in
// onboarding.
export type TrackKey = "core" | "pl400" | "claude_arch";
export type RouteKey = Exclude<TrackKey, "core">;

export interface LabResource {
  label: string;
  url: string;
}

export interface LabLesson {
  week: number; // 1-6
  date: string; // ISO date of that week's Thursday session
  track: TrackKey;
  title: string;
  objectives: string[]; // 3-5, each a thing the student can do afterwards
  prep: string[]; // before the session, 1-4 items
  resources: LabResource[]; // official/free links only
  exercise: string; // the hands-on work, tied to the student's own task
  deliverable: string; // what they submit in the portal
  examDomains?: string[]; // route lessons: which exam skill areas this covers
}

export const ONBOARDING_STEPS = [
  "contact",
  "github",
  "intro",
  "target_role",
  "route",
  "payment",
  "agreement",
  "jmcb_address",
] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];
