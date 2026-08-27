# Risk Management Policy

**Owner:** Jermaine F. Barker · **Effective:** 2026-08-26 · **Review:** annual

## Objectives
JMCB's security objectives (Information Security Policy §2) are the reference for identifying risk: exposure of regulated data, unreviewed production change, unrecoverable loss, and regulatory non-compliance. Risk is assessed against those objectives, not in the abstract.

## Risk appetite
- **Zero tolerance:** exposure of PHI, taxpayer data, or card data; secrets in source; unreviewed change to Tier-1 production.
- **Low tolerance:** open high/critical dependency vulnerabilities older than 14 days on Tier-1/2; missing backups; single key-holder without documented recovery.
- **Accepted:** Tier-3 marketing sites lacking auth, audit trail, or SOC 2 scope — recorded in the register as accepted.

## Method
1. **Identify** — sources: scanner fails, Dependabot, vendor notices, incidents, new features touching regulated data, new jurisdictions (CaughtUp STATE-COMPLIANCE rule), fraud/abuse scenarios.
2. **Analyze** — likelihood (1–5) × impact (1–5). Impact 5 = regulated-data breach or platform loss beyond RTO; 1 = cosmetic.
3. **Respond** — mitigate (control), transfer (vendor / cyber insurance `[CONFIRM: policy in force?]`), accept (owner sign-off, time-boxed), or avoid (don't build).
4. **Monitor** — register reviewed quarterly and at each monthly governance review; scores ≥ 12 need a named mitigation and date.

## Fraud and abuse risk
Considered explicitly for every platform with money or identity: Stripe payment fraud (CaughtUp, Runwei PP), account takeover, insider misuse of admin roles, fake sign-ups on public forms (Website leads, 60 Women), SMS abuse (Polintel). Mitigations: webhook signature checks, rate limiting, admin-action audit logs, opt-out enforcement.

## Change-driven reassessment
Triggered by: new subprocessor; new data class on a platform; new jurisdiction; major framework upgrade; any incident.

## Records
The Risk Register (`risk-register.md`) is the living record; each entry carries owner, score, response, and review date.
