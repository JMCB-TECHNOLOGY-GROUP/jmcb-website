# Data Classification Policy

**Owner:** Jermaine F. Barker · **Effective:** 2026-08-26 · **Review:** annual

## Classes
| Class | Definition | Examples across JMCB platforms | Handling |
|---|---|---|---|
| **Restricted** | Regulated personal data; exposure triggers statutory duties | PHI (TendivoHealth patients, observations, meds); taxpayer returns/transcripts (CaughtUp); card data (never stored — Stripe-hosted); government-ID numbers | RLS mandatory; MFA for any human access; encrypted at rest and in transit; no third-party scripts on surfaces showing it; de-identified before any AI call; BAA/DPA with every vendor touching it; breach clocks apply |
| **Confidential** | Non-public personal or client business data | user emails/phones, SMS consent records (Polintel), grant/provider records (Runwei), vessel and seafarer records (MarineOps), civic participant data (DPR), client contracts, pricing, source code of private repos | RLS or server-only access; least privilege; no personal devices/clouds; DPA with vendors |
| **Internal** | Operational information not intended for the public | architecture docs, scorecards, roadmaps, internal tooling, synthetic test data | JMCB accounts only; may use approved AI tooling |
| **Public** | Intended for publication | marketing sites, published posts, open documentation | none beyond integrity (change control) |

## Identification
Each platform's data inventory is produced by the scanner (`ID-04 piiInventory`) from schema evidence and confirmed in the repo's README / architecture doc. New tables holding Restricted or Confidential columns must be classified in the PR that adds them.

## Labelling
Repos declare their highest class via `tier` in `compliance/nist-scan.config.json` (1 = Restricted, 2 = Confidential, 3 = Internal/Public). Documents outside repos carry the class in the header when Restricted or Confidential.

## Rules by class (summary)
- Restricted never leaves Supabase/host except to a BAA/DPA-covered vendor or the authorized end-user.
- Confidential may be processed by registered subprocessors only.
- Internal may be shared with contractors under agreement.
- Public — no restriction.
