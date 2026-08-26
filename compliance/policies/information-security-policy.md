# Information Security Policy

**Owner:** Jermaine F. Barker · **Effective:** 2026-08-26 · **Review:** annual (August) · **Version:** 1.0

## 1. Purpose and scope
This policy establishes how JMCB Technology Group ("JMCB") protects the confidentiality, integrity, and availability of information across every platform it builds and operates — TendivoHealth, CaughtUp, Runwei Provider Portal, Polintel 21CC, MarineOps, ASCEND, JMCB Civic, and the marketing and tooling properties listed in `fleet.json`. It applies to the owner, contractors, interns (e.g., the SYCEP cohort), and any automated agent acting on JMCB's behalf.

## 2. Security objectives
1. No customer, patient, taxpayer, or citizen data is exposed to anyone without a business need.
2. Every production change is reviewed, tested, and traceable to a person.
3. Every platform can be restored within its declared RTO/RPO (Business Continuity & DR Plan).
4. Regulatory obligations are known per platform: HIPAA (TendivoHealth), GLBA Safeguards + IRC §7216 (CaughtUp), PCI DSS SAQ-A (Stripe platforms), state breach laws (DC, MD, VA, NY), CMMC / SP 800-171 posture (Watchstander).

## 3. Roles and responsibilities
| Role | Person | Responsibilities |
|---|---|---|
| Principal / Owner | Jermaine F. Barker | Approves this policy set; accepts risk; final authority on incidents |
| Qualified Individual (FTC Safeguards) | Jermaine F. Barker | Owns the written information security program for CaughtUp; annual program report |
| HIPAA Security & Privacy Officer | Jermaine F. Barker | TendivoHealth safeguards, BAAs, breach determinations |
| Engineering (contractors / interns) | as engaged | Follow Change Management, Access Control, Code of Conduct; report incidents within 1 hour |
| AI coding agents (Claude Code etc.) | n/a | Operate only under an authenticated human session; never commit secrets; changes land via PR |

Accountability: the owner signs this policy; contributors acknowledge the Code of Conduct on onboarding. Violations are handled under the Onboarding/Offboarding policy (access termination).

## 4. Policy statements
- **Access** is least-privilege, role-based, MFA-protected, and reviewed quarterly (Access Control Policy).
- **Data** is classified Public / Internal / Confidential / Restricted and handled per class (Data Classification Policy).
- **Secrets** live only in platform environment stores (Vercel, Netlify, Supabase, GitHub Actions secrets) — never in source, chat, or tickets.
- **Change** reaches production only via pull request on a protected branch with passing CI (Change Management Policy).
- **Vendors** that touch Confidential or Restricted data are recorded in the Subprocessor Register with their SOC 2 / HIPAA posture (Vendor Management Policy).
- **Monitoring**: Dependabot, `npm audit`, and the NIST/SOC 2 scanner run on every PR and weekly; findings are tracked as GitHub issues labelled `security`.
- **Incidents** follow the Incident Response Plan; breach-notification clocks are pre-computed per jurisdiction.
- **Continuity**: backups are verified by an annual restore test recorded in the Restore Test Log.
- **Training**: everyone with access completes security awareness on onboarding and annually.

## 5. Compliance measurement
The `compliance/` scanner in every repo is the continuous control check. Scores, fails, and waivers are reviewed at the monthly governance review (Governance Charter). Any waived control carries a written reason in `compliance/nist-scan.config.json`.

## 6. Exceptions
Requested in writing to the owner, time-boxed (max 90 days), recorded in the Risk Register, re-approved on expiry.

## 7. Enforcement
Non-compliance results in access removal and, for contractors, contract termination. Suspected criminal activity is referred to counsel.

*Signed:* Jermaine F. Barker, Principal — 2026-08-26
