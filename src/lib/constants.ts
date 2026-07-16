// Single source of truth for outbound scheduling links and site config.
// The enterprise page intentionally uses a separate Calendly event type so
// enterprise bookings can be triaged differently — keep both defined here
// rather than inline so they can't drift per-page.
export const SITE_URL = "https://jmcbtech.com";

export const CALENDLY_URL =
  "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";

export const CALENDLY_ENTERPRISE_URL =
  "https://calendly.com/jermaine-jmcbtech/enterprise-ai-strategy";
