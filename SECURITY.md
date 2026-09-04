# Security Policy — JMCB-Website

This platform is operated by JMCB Technology Group under the company security program in [`compliance/policies/`](compliance/policies/README.md): Information Security Policy, Access Control, Change Management, Incident Response Plan (with breach-notification obligations), Business Continuity / backup & restore, Data Classification, Retention & Disposal, Vendor Management and Subprocessor Register.

## Reporting a vulnerability
Email **jermaine@jmcbtech.com** with subject `SECURITY` — do not open a public issue. We acknowledge within 2 business days and follow the [Incident Response Plan](compliance/policies/incident-response-plan.md).

## Incident response and breach notification
Incidents are triaged within 1 hour by the Incident Commander (Jermaine F. Barker). Breach-notification clocks (HIPAA 60 days, FTC Safeguards 30 days, NY SHIELD 30 days, MD 45 days, DC/VA without unreasonable delay) are pre-computed in the Incident Response Plan §4.

## Backups and recovery
Managed-database daily backups; restore path and RTO/RPO in the [Business Continuity & DR Plan](compliance/policies/business-continuity-dr-plan.md); restore tests recorded in the Restore Test Log.

## Continuous control checks
`npm run scan:nist` (or `scan-nist.ps1`) produces this repo's NIST / SOC 2 scorecard in `compliance/SCORECARD.md`; it also runs in CI on every pull request and weekly.
