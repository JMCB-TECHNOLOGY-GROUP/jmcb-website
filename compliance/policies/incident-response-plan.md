# Incident Response Plan

**Owner / Incident Commander:** Jermaine F. Barker (jermaine@jmcbtech.com) · **Effective:** 2026-08-26 · **Review:** annual + after every incident · **Tabletop:** annually (next: 2026-11)

## 1. What is an incident
Any confirmed or suspected event that threatens confidentiality, integrity, or availability: unauthorized access, credential leak, malware, data exposure (including mis-configured RLS or a public bucket), vendor breach affecting our data, prolonged outage, lost device with data, or a valid vulnerability report.

## 2. Severity
| Sev | Definition | Examples | Owner notified |
|---|---|---|---|
| 1 | Regulated data exposed or likely exposed; platform down for Tier-1 | PHI/taxpayer/card data reachable; service-role key leaked | immediately |
| 2 | Confidential data at risk; security control failed | unauthenticated route found writing data; open high-severity vuln exploited | within 1 h |
| 3 | Limited impact | single-user account issue; low-severity report | within 24 h |

## 3. Procedure
1. **Detect / report** — anyone: email jermaine@jmcbtech.com with subject `SECURITY INCIDENT` (or call `[CONFIRM: number]`). Sources: Sentry, Supabase logs, Dependabot, vendor notices, user reports to security@ `[CONFIRM: alias]`.
2. **Triage (≤ 1 h)** — owner assigns severity, opens a private GitHub issue labelled `security` + `incident`, starts the timeline.
3. **Contain** — rotate exposed credentials (Supabase service role, Stripe, Twilio, Anthropic, GitHub tokens); disable affected routes (HTTP 410 pattern); revoke sessions; pause the Vercel project if needed.
4. **Eradicate** — fix root cause via emergency PR (Change Management §5); re-run scanner.
5. **Recover** — restore from backup if integrity is in doubt (BCP §4); verify with proof (screenshots / tests).
6. **Assess notification** (§4) — determine scope, data classes, jurisdictions, and start the clocks.
7. **Post-incident** — within 5 business days: written review (cause, timeline, what worked, actions), Risk Register updated, policy changes if needed, training refresh if human error.

## 4. Breach-notification obligations (clocks start at *discovery*)
| Regime | Applies to | Who to notify | Deadline |
|---|---|---|---|
| HIPAA Breach Notification Rule (45 CFR 164.400-414) | TendivoHealth (PHI) | Covered-entity client (we are a BA) **without unreasonable delay, ≤ 60 days**; CE notifies individuals/HHS/media | ≤ 60 days; contract may require faster `[CONFIRM BAA terms]` |
| FTC Safeguards Rule 314.4(j) | CaughtUp (customer info, ≥ 500 consumers) | FTC via online form | **30 days** |
| DC §28-3852 | DC residents | individuals; AG if ≥ 50 residents | most expedient time; AG same time |
| Maryland PIPA §14-3504 | MD residents | individuals + AG | **45 days** |
| Virginia §18.2-186.6 | VA residents | individuals; AG if ≥ 1,000 | without unreasonable delay |
| New York SHIELD §899-aa | NY residents | individuals + AG, DOS, State Police | **30 days** |
| PCI DSS / Stripe | card-data incidents | Stripe + acquirer | immediately |
| Client contracts | Runwei, Polintel/CBCI, MARAD, NDIA | client contact | per contract `[CONFIRM SLAs]` |
| Guyana / T&T | MarineOps, KokerWatch, Tendivo (Guyana) | Guyana Data Protection Act 2023 — Data Protection Commissioner; T&T DPA 2011 | `[CONFIRM: Guyana Commissioner operational status]` |

Notification content: what happened, data involved, what we did, what the recipient should do, contact point. Counsel reviewed before sending `[CONFIRM: counsel]`.

## 5. Contacts
| Role | Name | Channel |
|---|---|---|
| Incident Commander | Jermaine F. Barker | jermaine@jmcbtech.com |
| Backup / emergency contact | `[CONFIRM]` | |
| Counsel | `[CONFIRM]` | |
| Cyber insurance | `[CONFIRM: carrier / policy #]` | |
| Supabase support | dashboard → support | Pro/Team plan SLA |
| Vercel support | dashboard → support | |

## 6. Evidence handling
Preserve logs (Supabase, Vercel, Sentry, GitHub audit log) before rotation where possible; export to the incident issue; do not alter timestamps.
