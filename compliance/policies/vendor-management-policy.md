# Vendor Management Policy

**Owner:** Jermaine F. Barker · **Effective:** 2026-08-26 · **Review:** annual

## 1. Scope
Any third party that stores, processes, or can access JMCB or client data, or that is in the delivery path of a platform (hosting, database, auth, email/SMS, payments, AI APIs, error monitoring, source control). All are listed in the Subprocessor Register.

## 2. Inherited controls
JMCB does not operate data centers. Physical and environmental security (SOC 2 CC6.4), hardware disposal, and infrastructure availability are **inherited** from cloud vendors and evidenced by their SOC 2 Type II reports, which the owner collects annually (most are downloadable from vendor trust centers).

## 3. Before engaging a vendor
- Classify the data it will touch (Data Classification Policy). Confidential/Restricted ⇒ vendor must show SOC 2 Type II or ISO 27001 **and** sign a DPA; PHI ⇒ a **BAA** is mandatory before any PHI flows; card data ⇒ PCI DSS AoC.
- Confirm data location, retention, sub-processor list, breach-notification SLA, and deletion on termination.
- Record the vendor in the Subprocessor Register with the evidence collected.

## 4. Ongoing
- Annual review of each Tier-1-relevant vendor's report / trust-center status; note bridge letters.
- Vendor security incidents are handled as JMCB incidents (Incident Response Plan §3).
- Removal: on termination, confirm data deletion in writing and update the register.

## 5. AI providers
LLM APIs (Anthropic, others) are vendors. Rules: no PHI or taxpayer data sent without de-identification; use zero-data-retention / no-training terms where offered; log the model and purpose per platform. `[CONFIRM: Anthropic commercial terms + ZDR for TendivoHealth]`

## 6. Client-side and open-source dependencies
npm dependencies are supply-chain vendors: lockfiles committed, Dependabot on, `npm audit` in CI, high/critical fixed within 14 days on Tier-1/2 (Risk R-02).
