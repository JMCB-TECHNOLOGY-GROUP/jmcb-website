"use client";

import { track } from "@vercel/analytics";

/**
 * Fire a custom analytics event. Never throws — analytics must not break UX.
 *
 * Conversion events used across the site:
 * - "calendly_click"       { location } — any Book a Call / Strategy Briefing CTA
 * - "assessment_completed" { band }     — final assessment submit succeeded
 * - "contact_submitted"    {}           — contact form submitted
 */
export function trackEvent(
  name: string,
  props?: Record<string, string | number | boolean | null>
) {
  try {
    track(name, props);
  } catch {
    // no-op: analytics failures are invisible to users by design
  }
}
