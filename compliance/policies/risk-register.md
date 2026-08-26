# Risk Register

**Owner:** Jermaine F. Barker · **Last full review:** 2026-08-26 · **Next:** 2026-11-26 (quarterly)

Scoring: Likelihood (L) 1–5 × Impact (I) 1–5 = Score. ≥ 12 requires a dated mitigation.

| ID | Risk | Platforms | L | I | Score | Response | Owner | Status / date |
|---|---|---|---|---|---|---|---|---|
| R-01 | PHI cached in browser IndexedDB unencrypted (offline sync engine) | TendivoHealth | 3 | 5 | 15 | Mitigate: WebCrypto AES-GCM on the offline store (scanner HI-03) | JFB | Open — target 2026-09-30 |
| R-02 | Dependabot drift: high/critical alerts open (Civic 46, Conferences 51, ASCEND 26, KokerWatch 5, Tendivo 3) | Civic, Conferences, ASCEND, KokerWatch, Tendivo | 4 | 4 | 16 | Mitigate: sweep + enable auto-PRs; ASCEND gated on Next 15 decision | JFB | Open — 2026-09-15 |
| R-03 | No branch protection: owner or agent can push to main unreviewed | 14 of 17 git repos | 4 | 4 | 16 | Mitigate: rulesets on Tier-1/2 default branches (PR required, status checks) | JFB | Open — 2026-09-05 |
| R-04 | Single key-holder: owner is sole admin on GitHub / Supabase / Vercel / Stripe | all | 3 | 5 | 15 | Mitigate: recovery codes in sealed location + designated emergency contact `[CONFIRM]` | JFB | Open |
| R-05 | Public POST endpoints without rate limit / captcha (leads, contact, assessment) | JMCB-Website | 4 | 2 | 8 | Mitigate: Vercel WAF rate rule + Turnstile | JFB | Open |
| R-06 | No incident-response runbook practiced; breach clocks unknown to contributors | all | 3 | 4 | 12 | Mitigate: IR Plan (this pack) + annual tabletop | JFB | Policy in place 2026-08-26; tabletop due 2026-11 |
| R-07 | AI / telemetry egress of PHI (Sentry, Anthropic API) without scrubbing | TendivoHealth | 3 | 5 | 15 | Mitigate: `sendDefaultPii:false` + beforeSend scrub; de-identify before LLM calls; BAA / zero-retention with Anthropic `[CONFIRM]` | JFB | Open |
| R-08 | §7216 violation via analytics / pixel on tax-document surfaces | CaughtUp | 2 | 5 | 10 | Avoid: no third-party scripts on app routes (scanner GL-03 enforces) | JFB | Controlled |
| R-09 | Vendor (Supabase / Vercel / Netlify) outage beyond RTO | Tier-1/2 | 2 | 4 | 8 | Accept + BCP: documented restore path; no multi-cloud | JFB | Accepted 2026-08-26 |
| R-10 | Intern / contractor retains access after engagement | all | 3 | 3 | 9 | Mitigate: 24-hour offboarding checklist; quarterly access review | JFB | Controlled by policy |
| R-11 | Payment fraud / chargebacks (Stripe) | CaughtUp, Runwei PP | 2 | 3 | 6 | Transfer to Stripe Radar; webhook signature verification | JFB | Controlled |
| R-12 | SMS abuse / TCPA exposure | Polintel | 2 | 4 | 8 | Mitigate: consent record + STOP/HELP sync | JFB | Controlled |
| R-13 | Tier-3 static sites hold form submissions in Supabase with no auth surface | 60 Women, Guyana Inspired, Roianne | 2 | 2 | 4 | Accept: insert-only tables, no client read path | JFB | Accepted |
| R-14 | Watchstander / CMMC obligations if activated without SSP + POA&M | Watchstander | 1 | 4 | 4 | Avoid: project parked; revisit on activation triggers | JFB | Accepted (parked) |

## Fraud / abuse scenarios reviewed 2026-08-26
Account takeover (MFA where enrolled — gap on platforms without enforcement, scanner PR-02); fake lead submissions (R-05); insider admin misuse (audit logs — gap on most platforms, scanner DE-02); payment fraud (R-11); SMS pumping (R-12).
