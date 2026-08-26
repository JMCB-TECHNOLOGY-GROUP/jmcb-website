# Subprocessor Register

**Owner:** Jermaine F. Barker · **Last reviewed:** 2026-08-26 · **Review:** annual + on every addition

Vendors that store, process, or can access JMCB or client data. Derived from the dependency and configuration evidence in each platform repo (scanner stack detection) — not from memory. Evidence column = what the auditor will ask to see; `[CONFIRM]` = not yet collected.

| Vendor | Purpose | Platforms | Data class touched | Region | Assurance | Agreement | Evidence on file |
|---|---|---|---|---|---|---|---|
| Supabase | Postgres, Auth, storage | Tendivo, CaughtUp, Polintel, MarineOps, ASCEND, Civic, Conferences, ChairTime, 60 Women, Guyana Inspired | Restricted (PHI, taxpayer), Confidential | US-East `[CONFIRM per project]` | SOC 2 Type II, HIPAA (BAA on Team/Enterprise) | DPA; **BAA required for Tendivo** | `[CONFIRM: BAA signed?]` |
| Vercel | Hosting, serverless, edge | Tendivo, CaughtUp, Runwei PP, ASCEND, Civic, Conferences, Website, KokerWatch, Roianne, Polintel (fallback) | Confidential in transit; logs | Global edge, US functions | SOC 2 Type II, HIPAA (BAA on Enterprise) | DPA | `[CONFIRM: report downloaded]` |
| Netlify | Functions + hosting | Polintel 21CC | Confidential | US | SOC 2 Type II | DPA | `[CONFIRM]` |
| GitHub (Microsoft) | Source control, CI, Dependabot | all | Internal; secrets in Actions | US | SOC 2 Type II, ISO 27001 | ToS + DPA | `[CONFIRM]` |
| Anthropic | Claude API (AI features, agents, tooling) | ASCEND, Runwei services, SignalScout, Tendivo (planned), Polintel | Confidential — **no PHI/taxpayer without de-identification** | US | SOC 2 Type II, HIPAA-eligible w/ BAA | Commercial terms; ZDR `[CONFIRM]` | `[CONFIRM]` |
| Stripe | Payments | CaughtUp, Runwei Provider Portal | Card data (Stripe-hosted; JMCB stores tokens/last4 only) | US | PCI DSS Level 1, SOC 2 | Services agreement | AoC `[CONFIRM]` |
| Twilio | SMS alerts + inbound | Polintel 21CC | Confidential (phone numbers, consent) | US | SOC 2 Type II, ISO 27001 | ToS + DPA | `[CONFIRM]` |
| Resend | Transactional email | CaughtUp (pending account), 60 Women automation, Website | Confidential (emails) | US | SOC 2 Type II | ToS | `[CONFIRM]` |
| Mailgun (Sinch) | Transactional email | Runwei Provider Portal | Confidential | US/EU | SOC 2 Type II | ToS | `[CONFIRM]` |
| Sentry | Error monitoring | Tendivo, Website, Runwei WWW/Admin | Internal; **PII scrubbed** (`sendDefaultPii:false`) | US | SOC 2 Type II, HIPAA w/ BAA | ToS; BAA for Tendivo `[CONFIRM]` | `[CONFIRM]` |
| Google Workspace | Email, calendar, drive (jermaine.f.barker@gmail / Meet) | company ops | Confidential | US | SOC 2, ISO 27001 | ToS | n/a |
| Microsoft 365 (GoDaddy-hosted) | jermaine@jmcbtech.com mail | company ops | Confidential | US | SOC 2, ISO 27001 | ToS | n/a |
| Cloudflare | DNS (Runwei) | Runwei properties | none (DNS) | global | SOC 2 Type II | ToS | n/a |
| Meta Graph API / Canva / LinkedIn / TikTok APIs | Social publishing connectors | ASCEND | OAuth tokens (Confidential) | US | platform ToS | developer terms | token-refresh cron; tokens encrypted at rest `[CONFIRM]` |
| ElevenLabs | Voice synthesis (tooling only) | claude-voice | none (no client data) | US | — | ToS | n/a |

## Rules
1. A vendor is added here **before** any Confidential/Restricted data flows to it (Vendor Management Policy §3).
2. PHI ⇒ BAA on file **before** go-live: Supabase, Vercel, Sentry, Anthropic for TendivoHealth. None confirmed as of 2026-08-26 — this is a go-live gate.
3. The public-facing subprocessor list in each platform's privacy notice is generated from the rows above that apply to that platform (Privacy & DSAR Procedure §2).
