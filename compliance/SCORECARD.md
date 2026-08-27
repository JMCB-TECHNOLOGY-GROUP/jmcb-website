# NIST Compliance Scorecard — JMCB-Website

Repo: `jmcb-website` · Stack: next, supabase, vercel · Scanned: 2026-08-26 21:27 UTC

Frameworks: NIST CSF 2.0 · NIST SP 800-53 Rev 5 · NIST SP 800-171 Rev 2 · NIST Privacy Framework 1.0

## Score: **87%** (27 pass · 8 warn · 0 fail · 1 n/a)

| CSF 2.0 Function | Score | Pass | Warn | Fail | N/A |
|---|---|---|---|---|---|
| GOVERN | 92% | 3 | 1 | 0 | 0 |
| IDENTIFY | 69% | 2 | 2 | 0 | 0 |
| PROTECT | 90% | 13 | 3 | 0 | 1 |
| DETECT | 81% | 2 | 1 | 0 | 0 |
| RESPOND | 100% | 2 | 0 | 0 | 0 |
| RECOVER | 100% | 2 | 0 | 0 | 0 |
| PRIVACY | 83% | 3 | 1 | 0 | 0 |

## NIST base controls

| | ID | Control | CSF 2.0 | SP 800-53 | SP 800-171 | Privacy Fw | Evidence |
|---|---|---|---|---|---|---|---|
| ✅ | GV-01 | Security policy is documented and published | GV.PO-01 | PL-1, PM-1 | 3.12.4 |  | policy doc(s): SECURITY.md |
| ⚠️ | GV-02 | Ownership / accountability for code review is assigned | GV.RR-02 | PM-2, CM-3 | 3.4.3 |  | PR template but no CODEOWNERS |
| ✅ | GV-03 | Third-party dependency risk is managed (automated supply-chain monitoring) | GV.SC-07 | SR-3, SA-9, RA-5 | 3.11.2 |  | Dependabot alerts enabled, 0 open (+ dependabot.yml) |
| ✅ | GV-04 | Vulnerability disclosure channel exists | GV.PO-02 | SI-5, IR-6 | 3.6.2 |  | disclosure instructions found in docs |
| ✅ | ID-01 | System / architecture is documented (asset inventory) | ID.AM-01 | CM-8, PL-2 | 3.4.1 |  | architecture docs: docs/architecture.md |
| ✅ | ID-02 | Software inventory is pinned (lockfile committed) | ID.AM-02 | CM-8, CM-2 | 3.4.1 |  | package-lock.json committed |
| ⚠️ | ID-03 | Known vulnerabilities in dependencies are identified (npm audit) | ID.RA-01 | RA-5, SI-2 | 3.11.2, 3.14.1 |  | npm audit produced no parseable output (offline?) |
| ⚠️ | ID-04 | Data inventory: personal / sensitive data columns are identified | ID.AM-07 | PM-5(1), PT-2 |  | ID.IM-P8 | 5 personal-data column(s) detected; no written data inventory |
| ⚠️ | PR-01 | Identity management: an authentication provider is integrated | PR.AA-01 | IA-2, IA-8 | 3.5.1, 3.5.2 |  | Supabase Auth, Clerk installed but no server-side session verification found |
| ⚠️ | PR-02 | Multi-factor authentication is available / enforced | PR.AA-03 | IA-2(1), IA-2(2) | 3.5.3 |  | MFA referenced only in docs; not implemented |
| ✅ | PR-03 | Access is enforced server-side (middleware / route guards) | PR.AA-05 | AC-3, AC-6 | 3.1.1, 3.1.2 |  | 11 guarded server file(s); 0 unguarded mutating handlers |
| ✅ | PR-04 | Row-level security enabled on every data table | PR.AA-05 | AC-3, AC-6, SC-4 | 3.1.3 |  | 7 table(s), RLS enabled on all |
| ✅ | PR-05 | Least privilege: privileged (service-role) keys never reach the client | PR.AA-05 | AC-6, AC-6(5) | 3.1.5 |  | no privileged keys in client code |
| ✅ | PR-06 | Secrets are not committed to source | PR.DS-10 | IA-5, IA-5(7), SC-28 | 3.5.10 |  | no credential literals detected in source |
| ➖ | PR-07 | Environment files are git-ignored and not tracked | PR.DS-10 | IA-5, CM-6 | 3.5.10 |  | not a git repo |
| ✅ | PR-08 | Data in transit is protected (HSTS / HTTPS enforcement) | PR.DS-02 | SC-8, SC-8(1), SC-23 | 3.13.8 |  | HSTS header set |
| ✅ | PR-09 | Data at rest is on an encrypted managed datastore | PR.DS-01 | SC-28, SC-28(1) | 3.13.16 |  | Supabase Postgres (AES-256 at rest, managed) |
| ⚠️ | PR-10 | Secure configuration baseline: browser security headers | PR.PS-01 | CM-6, SC-18, SI-10 | 3.4.2 |  | headers present: X-Frame-Options / frame-ancestors, X-Content-Type-Options, Referrer-Policy, Permissions-Policy; missing: Content-Security-Policy |
| ✅ | PR-11 | Input validation on server boundaries | PR.PS-01 | SI-10 | 3.14.1 |  | zod used in 5+ server file(s) |
| ✅ | PR-12 | Rate limiting / denial-of-service protection on APIs | PR.IR-04 | SC-5, SC-5(2) |  |  | rate limiting implemented |
| ✅ | PR-13 | Boundary protection: CORS origin allowlist | PR.IR-01 | SC-7, AC-4 | 3.13.1 |  | same-origin only (no CORS headers emitted) |
| ✅ | PR-14 | Secure SDLC: CI enforces lint / typecheck / tests | PR.PS-06 | SA-11, SA-15 |  |  | CI gates: lint, typecheck, test, build (3 workflow(s)) |
| ✅ | PR-15 | Change control: protected default branch, PRs required | PR.PS-01 | CM-3, CM-5 | 3.4.3, 3.4.5 |  | main protected: PR reviews, status checks |
| ✅ | PR-16 | Schema changes are versioned migrations | PR.PS-01 | CM-3, CM-2 | 3.4.3 |  | versioned migrations: supabase/migrations |
| ✅ | PR-17 | Static analysis / CodeQL or equivalent in CI | PR.PS-06 | SA-11(1), RA-5 | 3.11.2 |  | SAST / secret scanning in CI |
| ✅ | DE-01 | Runtime error / exception monitoring | DE.CM-09 | SI-4, AU-6 | 3.14.6 |  | Sentry, Vercel Analytics, Vercel Speed Insights |
| ⚠️ | DE-02 | Audit trail of security-relevant events (auth, admin, data changes) | DE.CM-01 | AU-2, AU-3, AU-12 | 3.3.1, 3.3.2 |  | partial audit trail (table or writer, not both) |
| ✅ | DE-03 | Sensitive data is not written to logs | DE.CM-09 | AU-3(3), SI-12 |  | CT.DP-P4 | no sensitive identifiers passed to console logging |
| ✅ | RS-01 | Incident response procedure is documented | RS.MA-01 | IR-1, IR-4, IR-8 | 3.6.1 |  | incident-response procedure documented |
| ✅ | RS-02 | Breach-notification obligations are identified | RS.CO-02 | IR-6, PT-1 |  | GV.PO-P5 | breach-notification obligations documented |
| ✅ | RC-01 | Backup / restore posture is documented | RC.RP-01 | CP-9, CP-10 | 3.8.9 |  | backup / restore posture documented |
| ✅ | RC-02 | Infrastructure is reproducible (deploy config committed) | RC.RP-03 | CP-10, CM-2 |  |  | deploy config: vercel.json |
| ✅ | PV-01 | Privacy notice is published | GV.PO-01 | PT-5 |  | CM.AW-P1 | privacy page: compliance/policies/privacy-dsar-procedure.md |
| ✅ | PV-02 | Consent / opt-out mechanism for communications | GV.PO-01 | PT-4 |  | CT.PO-P2 | consent / opt-out handled |
| ⚠️ | PV-03 | Data retention / deletion capability | PR.DS-01 | SI-12, MP-6 |  | CT.DM-P4 | retention/deletion mentioned in docs only |
| ✅ | PV-04 | No third-party trackers on data-entry surfaces | PR.DS-02 | SC-7(10), PT-3 |  | CT.DP-P1 | no third-party trackers |

<details><summary>Finding details</summary>

**ID-04 Data inventory: personal / sensitive data columns are identified**

- `supabase/migrations/0001_baseline.sql` emails
- `supabase-schema.sql` email
- `supabase-schema.sql` first_name
- `supabase-schema.sql` last_name
- `supabase/migrations/0001_baseline.sql` phone

**PR-02 Multi-factor authentication is available / enforced**

- `compliance/policies/access-control-policy.md:6` Least privilege, need-to-know, named accounts, MFA everywhere it is offered, and periodic review. Applies to every system in the Subprocessor Register and to ev
- `compliance/policies/access-control-policy.md:14` - MFA is mandatory on GitHub, Supabase, Vercel, Netlify, Stripe, Twilio, Google Workspace, Microsoft 365.
- `compliance/policies/access-control-policy.md:15` - Platform end-users: Supabase Auth (or the platform's provider) with email verification; TOTP MFA is **required** for CaughtUp once server-side storage ships (
- `compliance/policies/code-of-conduct-acceptable-use.md:12` 4. Use your own named account; never share credentials; MFA is mandatory.
- `compliance/policies/data-classification-policy.md:8` / **Restricted** / Regulated personal data; exposure triggers statutory duties / PHI (TendivoHealth patients, observations, meds); taxpayer returns/transcripts 

**DE-02 Audit trail of security-relevant events (auth, admin, data changes)**

- `src/lib/supabase-schema.sql:149` CREATE TABLE IF NOT EXISTS admin_activity_log (
- `supabase/migrations/0001_baseline.sql:245` CREATE TABLE IF NOT EXISTS admin_activity_log (

**PV-03 Data retention / deletion capability**

- `compliance/policies/data-retention-disposal-policy.md:1` # Data Retention and Disposal Policy
- `compliance/policies/data-retention-disposal-policy.md:6` Keep data only as long as it serves the purpose it was collected for or as long as law requires; dispose of it securely and verifiably afterwards. Retention per
- `compliance/policies/data-retention-disposal-policy.md:8` ## Retention schedule

</details>

---
Scoring: PASS=1, WARN=0.5, FAIL=0, weighted (3 critical / 2 important / 1 hygiene). N/A excluded. Waivers in `compliance/nist-scan.config.json` count as PASS but stay visible.