/**
 * Lightweight bot screening for public form endpoints.
 *
 * Two signals, no external services:
 * - Honeypot: a hidden "website" field real users never see. Any value = bot.
 * - Time trap: forms send formStartedAt (ms epoch from page load). Direct
 *   POSTs never include it, and script fills arrive in under 3 seconds.
 *
 * Returns a reason string when the submission looks automated, else null.
 * Callers should silently accept flagged submissions (return the normal
 * success shape without persisting) so bots get no feedback signal.
 */
const MIN_FILL_MS = 3_000;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;

export function isLikelyBot(body: Record<string, unknown>): string | null {
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return "honeypot";
  }
  const started = Number(body.formStartedAt);
  if (!Number.isFinite(started) || started <= 0) {
    return "missing_timer";
  }
  const elapsed = Date.now() - started;
  if (elapsed < MIN_FILL_MS) {
    return "too_fast";
  }
  if (elapsed > MAX_FORM_AGE_MS) {
    return "stale_timer";
  }
  return null;
}
