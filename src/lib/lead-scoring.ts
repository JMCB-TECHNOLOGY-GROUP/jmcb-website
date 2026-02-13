// ============================================================
// ASSESSMENT-BACKEND: Lead Scoring Algorithm
// Classifies leads as Hot / Warm / Cold based on:
//   - Role seniority
//   - Company size
//   - Assessment scores (number of dimensions below 3)
// ============================================================

import type { CompanySize, Role } from "./assessment-content";

export type LeadScore = "hot" | "warm" | "cold";

interface LeadScoringInput {
  role: Role;
  companySize: CompanySize;
  answers: Record<string, number>; // questionId -> score (1-5)
}

interface LeadScoringResult {
  score: LeadScore;
  reason: string;
  dimensionsBelowThree: number;
  urgencySignals: string[];
}

// Role tiers for scoring
const EXECUTIVE_ROLES: Role[] = ["c-suite", "vp"];
const MANAGER_ROLES: Role[] = ["director", "manager", "business-owner"];
const INDIVIDUAL_ROLES: Role[] = [
  "individual-contributor",
  "consultant",
  "student",
];

// Company size tiers
const LARGE_COMPANY: CompanySize[] = ["51-200", "200+"];
const MID_COMPANY: CompanySize[] = ["11-50"];

export function scoreLeadQuality(input: LeadScoringInput): LeadScoringResult {
  const { role, companySize, answers } = input;

  const scores = Object.values(answers);
  const dimensionsBelowThree = scores.filter((s) => s < 3).length;
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const urgencySignals: string[] = [];

  // Track urgency signals
  if (dimensionsBelowThree >= 3)
    urgencySignals.push(`${dimensionsBelowThree} dimensions below 3`);
  if (EXECUTIVE_ROLES.includes(role))
    urgencySignals.push("Executive-level decision maker");
  if (LARGE_COMPANY.includes(companySize))
    urgencySignals.push(`Large company (${companySize} employees)`);
  if (avgScore < 2.5)
    urgencySignals.push("Low overall readiness signals high need");

  // ── HOT LEAD ──
  // C-suite/VP + company 50+ + scored below 3 on 3+ dimensions
  if (
    EXECUTIVE_ROLES.includes(role) &&
    (LARGE_COMPANY.includes(companySize) ||
      MID_COMPANY.includes(companySize)) &&
    dimensionsBelowThree >= 3
  ) {
    return {
      score: "hot",
      reason: `Executive at ${companySize}-employee company with ${dimensionsBelowThree} weak dimensions. High-value prospect needing immediate outreach.`,
      dimensionsBelowThree,
      urgencySignals,
    };
  }

  // Also hot: Business owner with 50+ employees and significant gaps
  if (
    role === "business-owner" &&
    LARGE_COMPANY.includes(companySize) &&
    dimensionsBelowThree >= 3
  ) {
    return {
      score: "hot",
      reason: `Business owner at ${companySize}-employee company with ${dimensionsBelowThree} critical gaps. Decision maker with clear pain points.`,
      dimensionsBelowThree,
      urgencySignals,
    };
  }

  // ── WARM LEAD ──
  // Manager+ or business owner + any company size + scored below 3 on 2+ dimensions
  if (
    (MANAGER_ROLES.includes(role) || EXECUTIVE_ROLES.includes(role)) &&
    dimensionsBelowThree >= 2
  ) {
    return {
      score: "warm",
      reason: `${role} with ${dimensionsBelowThree} dimensions needing improvement. Likely has influence over AI decisions.`,
      dimensionsBelowThree,
      urgencySignals,
    };
  }

  // Also warm: Any role at large company with many gaps
  if (LARGE_COMPANY.includes(companySize) && dimensionsBelowThree >= 4) {
    return {
      score: "warm",
      reason: `${companySize}-employee company with significant gaps (${dimensionsBelowThree} dimensions below 3). May be an internal champion.`,
      dimensionsBelowThree,
      urgencySignals,
    };
  }

  // ── COLD LEAD ──
  // Individual contributor, student, or scoring above 4 on most dimensions
  const dimensionsAboveFour = scores.filter((s) => s >= 4).length;
  let coldReason = "";

  if (INDIVIDUAL_ROLES.includes(role) && dimensionsBelowThree < 2) {
    coldReason = `${role} with relatively strong scores. May not have purchasing authority.`;
  } else if (dimensionsAboveFour >= scores.length * 0.6) {
    coldReason = `Already advanced in most dimensions (${dimensionsAboveFour}/${scores.length} scored 4+). Lower immediate need for consulting.`;
  } else if (role === "student") {
    coldReason =
      "Student -- valuable for brand awareness but unlikely near-term client.";
  } else {
    coldReason = `Moderate profile. Worth nurturing but not urgent outreach.`;
  }

  return {
    score: "cold",
    reason: coldReason,
    dimensionsBelowThree,
    urgencySignals,
  };
}

// ============================================================
// Notification check: should Jermaine be notified immediately?
// ============================================================

export function shouldNotifyImmediately(
  leadScore: LeadScoringResult
): boolean {
  return leadScore.score === "hot";
}
