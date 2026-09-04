# Security Governance Charter

**Owner:** Jermaine F. Barker · **Effective:** 2026-08-26 · **Review:** annual

## Purpose
JMCB is a single-principal company with no board. This charter defines the oversight the owner performs so that internal control is reviewed separately from day-to-day engineering (SOC 2 CC1.2, NIST CSF GV.OV).

## Oversight cadence
| Cadence | Activity | Evidence produced |
|---|---|---|
| Every PR | Scanner runs; CI gates | Workflow run + `compliance/SCORECARD.md` |
| Weekly (Mon 09:17 UTC) | Scheduled scan on every git-connected repo | Workflow artifact |
| Monthly (first Saturday) | **Governance review**: fleet scorecard, open `security` issues, Dependabot alerts, waivers, vendor changes | Dated entry in `governance-log.md` `[CONFIRM: create at first review]` |
| Quarterly | Access review (Access Control Policy §4); risk register refresh | Access review record; register diff |
| Annually (August) | Policy set review; restore test; IR tabletop; training refresh; Qualified Individual report (GLBA) | Updated policy versions; test log; tabletop notes |

## Decision rights
- Only the owner may accept a risk, approve a waiver, or approve an exception.
- Any contributor may halt a deploy or revoke access on suspicion of compromise; the owner is informed within 1 hour.

## Independence
Because the owner both builds and oversees, compensating controls apply: (1) branch protection prevents un-reviewed merges even by the owner `[CONFIRM: enable on all Tier-1/2 repos]`; (2) scanner evidence is machine-generated, not self-attested; (3) an external readiness assessment by the SOC 2 audit firm precedes any attestation.
