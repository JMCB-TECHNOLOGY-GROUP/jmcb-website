// ============================================================
// src/lib/resume.ts — CV capture, extraction and VERIFICATION.
//
// Why this exists: the assessment asks what someone WANTS. Their CV is the
// only place that says what they already HAVE. Together they let us reformat
// the CV and aim the training at real gaps.
//
// The rule this file enforces: nothing reaches the applicant that we cannot
// trace back to their own document. The model proposes; this module checks.
// Every skill, achievement and rewritten line must carry evidence that is
// found in the extracted source text, and any figure in a rewritten line must
// already exist in the CV. Anything unverified is DROPPED, not softened, and
// the counts are reported so the drop is visible rather than silent.
//
// This is only possible because lib/document-text.ts reduces every accepted
// format to text server-side before the model sees it — holding the real
// source is what makes checking possible.
// ============================================================

// Only the client-safe half: this module is imported by the browser.
import { ACCEPTED_EXTENSIONS, kindForFileName } from "./document-formats";

export { ACCEPTED_EXTENSIONS };

/**
 * Vercel caps a serverless request body at 4.5MB and base64 inflates by ~4/3,
 * so the raw file ceiling has to sit well under that. 2.5MB is far above any
 * real CV.
 */
export const MAX_RESUME_BYTES = 2.5 * 1024 * 1024;
export const MAX_RESUME_TEXT = 60_000;

/** A claim the model made, with the words from the CV that support it. */
export type Evidenced = {
  value: string;
  evidence: string;
};

export type SkillGroup = {
  category: string;
  skills: Evidenced[];
};

/**
 * Contact details lifted off the CV so the applicant confirms rather than
 * retypes. Email and phone are found by regex against the source text, never
 * by the model, so they cannot be invented; the model only says which of the
 * found candidates belongs to the applicant.
 */
export type ContactDetails = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
};

export type ResumeExtraction = {
  contact?: ContactDetails;
  currentTitle?: string;
  yearsExperience?: number;
  industries?: string[];
  skillGroups?: SkillGroup[];
  quantifiedAchievements?: Evidenced[];
  unquantifiedClaims?: Evidenced[];
  atsIssues?: string[];
  missingForTarget?: string[];
  education?: string[];
  summary?: string;
};

/** What verification threw away, so the UI and logs can say so out loud. */
export type VerificationReport = {
  skillsKept: number;
  skillsDropped: number;
  achievementsKept: number;
  achievementsDropped: number;
};

// ── matching ────────────────────────────────────────────────

/** Lowercase, strip punctuation that varies between renderers, collapse space. */
export function normalizeForMatch(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9%+#./ ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * True when a quote is genuinely grounded in the source. Exact containment
 * first; failing that, any five-word run of the quote must appear verbatim,
 * which tolerates a renderer's line breaks and the model tidying punctuation
 * without letting an invented sentence through.
 */
export function appearsInSource(quote: string, source: string): boolean {
  const q = normalizeForMatch(quote);
  const src = normalizeForMatch(source);
  if (!q || !src) return false;
  if (src.includes(q)) return true;

  const words = q.split(" ").filter(Boolean);
  const WINDOW = 5;
  if (words.length < WINDOW) return false;
  for (let i = 0; i + WINDOW <= words.length; i++) {
    if (src.includes(words.slice(i, i + WINDOW).join(" "))) return true;
  }
  return false;
}

/** Every distinct number token in a string, normalised for comparison. */
export function numbersIn(s: string): string[] {
  const found = s.match(/\d+(?:[.,]\d+)*/g) ?? [];
  return Array.from(new Set(found.map((n) => n.replace(/[.,]$/, "").replace(/,/g, ""))));
}

/**
 * CVs write small numbers as words, and turning "three sites" into "3 sites"
 * is a legitimate rewrite rather than an invention, so a spelled-out number in
 * the source grounds its digit form.
 */
const NUMBER_WORDS: Record<string, string> = {
  zero: "0", one: "1", two: "2", three: "3", four: "4", five: "5", six: "6",
  seven: "7", eight: "8", nine: "9", ten: "10", eleven: "11", twelve: "12",
  thirteen: "13", fourteen: "14", fifteen: "15", sixteen: "16",
  seventeen: "17", eighteen: "18", nineteen: "19", twenty: "20",
  thirty: "30", forty: "40", fifty: "50", sixty: "60", seventy: "70",
  eighty: "80", ninety: "90", hundred: "100", thousand: "1000",
  million: "1000000",
};

function digitsImpliedByWords(s: string): string[] {
  const out: string[] = [];
  for (const word of normalizeForMatch(s).split(" ")) {
    const digit = NUMBER_WORDS[word];
    if (digit) out.push(digit);
  }
  return out;
}

/**
 * A rewritten line may only contain figures that already exist in the CV, as
 * digits or as words. Placeholders like [X] are how the model is told to mark
 * a number only the applicant can supply, and they carry no digits, so they
 * pass by design.
 */
export function figuresAreGrounded(after: string, ...sources: string[]): boolean {
  const allowed = new Set(
    sources.flatMap((s) => [...numbersIn(s), ...digitsImpliedByWords(s)])
  );
  return numbersIn(after).every((n) => allowed.has(n));
}

// ── contact details ─────────────────────────────────────────

// Deliberately found by pattern, not by the model. A CV's email and phone are
// literal strings in the document, so there is no reason to let anything
// paraphrase them.

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const LINKEDIN_RE = /(?:https?:\/\/)?(?:[a-z]{2,3}\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+/gi;
// Loose shape, then filtered on digit count so dates and money don't match.
const PHONE_RE = /\+?\d[\d\s().-]{7,}\d/g;

export function findEmails(sourceText: string): string[] {
  return Array.from(new Set((sourceText.match(EMAIL_RE) ?? []).map((e) => e.trim())));
}

export function findLinkedIn(sourceText: string): string | undefined {
  return (sourceText.match(LINKEDIN_RE) ?? [])[0]?.trim();
}

export function findPhones(sourceText: string): string[] {
  const out: string[] = [];
  for (const raw of sourceText.match(PHONE_RE) ?? []) {
    const candidate = raw.trim().replace(/[.\-\s]+$/, "");
    const digits = candidate.replace(/\D/g, "");
    // Real numbers are 9 to 15 digits. Shorter is a year range or a quantity;
    // longer is usually two numbers that ran together.
    if (digits.length >= 9 && digits.length <= 15) out.push(candidate);
  }
  return Array.from(new Set(out));
}

/**
 * Settles the contact block. The model may only choose among values that are
 * literally present in the CV; anything else falls back to the first candidate
 * the document offers, and a name that isn't in the document is dropped.
 */
export function resolveContact(
  proposed: ContactDetails | undefined,
  sourceText: string
): ContactDetails {
  const emails = findEmails(sourceText);
  const phones = findPhones(sourceText);

  const chosenEmail =
    proposed?.email && emails.some((e) => e.toLowerCase() === proposed.email!.toLowerCase())
      ? emails.find((e) => e.toLowerCase() === proposed.email!.toLowerCase())
      : emails[0];

  const digitsOf = (s: string) => s.replace(/\D/g, "");
  const chosenPhone =
    proposed?.phone && phones.some((p) => digitsOf(p) === digitsOf(proposed.phone!))
      ? phones.find((p) => digitsOf(p) === digitsOf(proposed.phone!))
      : phones[0];

  // Names and location are the model's to read, but must appear in the CV.
  const keepIfPresent = (value: string | undefined) =>
    value && appearsInSource(value, sourceText) ? value.trim() : undefined;

  return {
    firstName: keepIfPresent(proposed?.firstName),
    lastName: keepIfPresent(proposed?.lastName),
    email: chosenEmail,
    phone: chosenPhone,
    location: keepIfPresent(proposed?.location),
    linkedin: findLinkedIn(sourceText),
  };
}

// ── file acceptance ─────────────────────────────────────────

export function validateResumeFile(file: { type: string; size: number; name: string }): string | null {
  if (!kindForFileName(file.name)) {
    return "We can read PDF, Word (.docx, .doc), OpenDocument (.odt), RTF and plain text. Please upload one of those, or paste the text.";
  }
  if (file.size > MAX_RESUME_BYTES) {
    return `That file is ${(file.size / 1024 / 1024).toFixed(1)}MB. Please keep it under 2.5MB.`;
  }
  if (file.size === 0) return "That file looks empty.";
  return null;
}

/** Flattens verified skills for storage, email and prompt reuse. */
export function flattenSkills(
  extraction:
    | { skillGroups?: { category?: string; skills?: { value?: string }[] | null }[] | null }
    | null
    | undefined
): string[] {
  if (!extraction?.skillGroups) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const group of extraction.skillGroups) {
    for (const skill of group?.skills ?? []) {
      const value = (skill?.value ?? "").trim();
      const key = value.toLowerCase();
      if (!value || seen.has(key)) continue;
      seen.add(key);
      out.push(value);
    }
  }
  return out;
}

// ── prompt ──────────────────────────────────────────────────

export function buildExtractionPrompt(targetRole?: string, targetTitle?: string): string {
  const target = [targetTitle, targetRole].filter(Boolean).join(" / ");
  return `You are reading a job seeker's CV to pull out what they can actually evidence.

${target ? `The role they are targeting: ${target}. Judge the CV against that target.` : "They have not named a target role, so judge the CV on its own terms."}

THE RULE THAT MATTERS MOST: every skill, achievement and claim you return must carry an "evidence" field quoting the CV VERBATIM. Copy the words exactly as they appear. Do not paraphrase into the evidence field, do not summarise, and never write evidence for something the CV does not say. Anything whose evidence cannot be found in the document is discarded before the applicant sees it, so an invented entry is worse than a missing one. If the CV is thin, return few items.

Extract:

- contact: {"firstName": "", "lastName": "", "email": "", "phone": "", "location": ""} — the applicant's own details as written at the top of the CV. If the document contains more than one email or phone number, choose the one that belongs to the applicant rather than a referee or a previous employer. Copy them exactly. Leave a field empty rather than guessing it.
- currentTitle: their most recent job title, exactly as written.
- yearsExperience: a single integer. Work it out from the employment dates. If the dates do not allow a calculation, omit it rather than guessing.
- industries: sectors they have actually worked in.
- skillGroups: real skills grouped under short category names you choose to fit this person. Each skill is {"value": "the skill", "evidence": "verbatim words from the CV"}. Only skills the CV evidences. Never add a skill because the target role wants it.
- quantifiedAchievements: achievements that ALREADY carry a number in the CV, as {"value": "...", "evidence": "verbatim"}.
- unquantifiedClaims: up to five statements claiming value with no figure attached, as {"value": "...", "evidence": "verbatim"}.
- atsIssues: concrete problems that would cost them automated screening or a six second human scan. Specific to this document, not generic advice.
- missingForTarget: skills or evidence the target role expects that this CV does not show.${target ? "" : " Return an empty array when no target was given."}
- education: qualifications and institutions as written.
- summary: two sentences describing what this person is, as a hiring manager would summarise them.

Rules: no em dashes or en dashes. Never state a number that is not in the CV.

Respond ONLY with JSON in this exact shape, no prose around it:
{"contact":{"firstName":"","lastName":"","email":"","phone":"","location":""},"currentTitle":"","yearsExperience":0,"industries":[],"skillGroups":[{"category":"","skills":[{"value":"","evidence":""}]}],"quantifiedAchievements":[{"value":"","evidence":""}],"unquantifiedClaims":[{"value":"","evidence":""}],"atsIssues":[],"missingForTarget":[],"education":[],"summary":""}`;
}

// ── normalisation and verification ──────────────────────────

const strArray = (v: unknown, cap = 20): string[] =>
  Array.isArray(v)
    ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "").map((x) => x.trim()).slice(0, cap)
    : [];

function evidencedArray(v: unknown, cap: number): Evidenced[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => {
      const o = (item ?? {}) as Record<string, unknown>;
      return {
        value: typeof o.value === "string" ? o.value.trim() : "",
        evidence: typeof o.evidence === "string" ? o.evidence.trim() : "",
      };
    })
    .filter((e) => e.value !== "")
    .slice(0, cap);
}

/** Defensive coercion. A malformed field degrades to empty, never throws. */
export function normalizeExtraction(raw: unknown): ResumeExtraction {
  const o = (raw ?? {}) as Record<string, unknown>;

  const groups: SkillGroup[] = Array.isArray(o.skillGroups)
    ? (o.skillGroups as unknown[])
        .map((g) => {
          const gg = (g ?? {}) as Record<string, unknown>;
          return {
            category: typeof gg.category === "string" && gg.category.trim() ? gg.category.trim() : "Skills",
            skills: evidencedArray(gg.skills, 40),
          };
        })
        .filter((g) => g.skills.length > 0)
        .slice(0, 8)
    : [];

  const years = Number(o.yearsExperience);

  const c = (o.contact ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

  return {
    // Proposed only — resolveContact decides what survives.
    contact: {
      firstName: str(c.firstName),
      lastName: str(c.lastName),
      email: str(c.email),
      phone: str(c.phone),
      location: str(c.location),
    },
    currentTitle: typeof o.currentTitle === "string" && o.currentTitle.trim() ? o.currentTitle.trim() : undefined,
    yearsExperience: Number.isFinite(years) && years > 0 && years < 70 ? Math.round(years) : undefined,
    industries: strArray(o.industries, 10),
    skillGroups: groups,
    quantifiedAchievements: evidencedArray(o.quantifiedAchievements, 10),
    unquantifiedClaims: evidencedArray(o.unquantifiedClaims, 5),
    atsIssues: strArray(o.atsIssues, 8),
    missingForTarget: strArray(o.missingForTarget, 10),
    education: strArray(o.education, 8),
    summary: typeof o.summary === "string" && o.summary.trim() ? o.summary.trim() : undefined,
  };
}

/**
 * Drops everything the source text does not support. A skill survives only if
 * its own words appear in the CV; an achievement survives only if its quoted
 * evidence does. Returns the pruned extraction and what was removed.
 */
export function verifyExtraction(
  extraction: ResumeExtraction,
  sourceText: string
): { verified: ResumeExtraction; report: VerificationReport } {
  let skillsKept = 0;
  let skillsDropped = 0;
  let achievementsKept = 0;
  let achievementsDropped = 0;

  const keepEvidenced = (items: Evidenced[] | undefined, requireValueInSource: boolean): Evidenced[] =>
    (items ?? []).filter((item) => {
      const grounded = requireValueInSource
        ? appearsInSource(item.value, sourceText)
        : appearsInSource(item.evidence, sourceText);
      return grounded;
    });

  const skillGroups = (extraction.skillGroups ?? [])
    .map((group) => {
      // A skill is one or two words, so match on the skill itself rather than
      // a window of its evidence — that is the stronger check here.
      const kept = keepEvidenced(group.skills, true);
      skillsKept += kept.length;
      skillsDropped += group.skills.length - kept.length;
      return { ...group, skills: kept };
    })
    .filter((g) => g.skills.length > 0);

  const quantified = keepEvidenced(extraction.quantifiedAchievements, false);
  achievementsKept += quantified.length;
  achievementsDropped += (extraction.quantifiedAchievements ?? []).length - quantified.length;

  const unquantified = keepEvidenced(extraction.unquantifiedClaims, false);
  achievementsKept += unquantified.length;
  achievementsDropped += (extraction.unquantifiedClaims ?? []).length - unquantified.length;

  // A quantified achievement must not carry a figure the CV never stated.
  const quantifiedChecked = quantified.filter((a) => figuresAreGrounded(a.value, a.evidence, sourceText));
  achievementsDropped += quantified.length - quantifiedChecked.length;
  achievementsKept -= quantified.length - quantifiedChecked.length;

  return {
    verified: {
      ...extraction,
      contact: resolveContact(extraction.contact, sourceText),
      skillGroups,
      quantifiedAchievements: quantifiedChecked,
      unquantifiedClaims: unquantified,
    },
    report: { skillsKept, skillsDropped, achievementsKept, achievementsDropped },
  };
}

export type BulletRewrite = { before: string; after: string; note: string };

/**
 * A rewritten line survives only if the line it replaces is really in the CV
 * and the rewrite introduces no figure the CV does not contain.
 */
export function verifyRewrites(
  rewrites: BulletRewrite[] | undefined,
  sourceText: string
): { kept: BulletRewrite[]; dropped: number } {
  const all = Array.isArray(rewrites) ? rewrites : [];
  const kept = all.filter(
    (r) =>
      typeof r?.before === "string" &&
      typeof r?.after === "string" &&
      appearsInSource(r.before, sourceText) &&
      figuresAreGrounded(r.after, r.before, sourceText)
  );
  return { kept, dropped: all.length - kept.length };
}
