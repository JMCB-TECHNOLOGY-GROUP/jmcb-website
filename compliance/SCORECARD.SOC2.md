# SOC 2 Readiness — JMCB-Website

Trust Services Criteria (AICPA TSC 2017 / 2022 PoF) · categories in scope: Security, Availability, Confidentiality, Processing integrity, Privacy · scanned 2026-08-26

> **This is a readiness assessment, not a SOC 2 report.** A SOC 2 Type I attests control *design* at a point in time; Type II attests *operating effectiveness* over 3–12 months. Both require an independent CPA firm. Technical criteria below are scored from repo evidence; organizational criteria are scored on whether the document an auditor will request exists.

## Readiness: **75%** — remediation phase (close FAILs, then readiness assessment)

| Category | Score | Pass | Warn | Fail |
|---|---|---|---|---|
| Security | 73% | 15 | 18 | 0 |
| Availability | 67% | 2 | 0 | 1 |
| Confidentiality | 50% | 0 | 2 | 0 |
| Processing integrity | 100% | 5 | 0 | 0 |
| Privacy | 81% | 5 | 3 | 0 |

## Documents an auditor will ask for that do not exist

- [ ] document exists but the test has not been performed: compliance/policies/restore-test-log.md

## All criteria

### CC1 Control environment

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ✅ | CC1.1 | Commitment to integrity and ethical values (code of conduct) | organizational | document: compliance/policies/code-of-conduct-acceptable-use.md |
| ⚠️ | CC1.2 | Board / owner oversight of internal control | organizational | document exists (compliance/policies/governance-charter.md) with 2 [CONFIRM] item(s) awaiting owner decision — not audit-ready until resolved |
| ✅ | CC1.3 | Organizational structure, reporting lines, authorities | organizational | ownership documented (CODEOWNERS / roles section) |
| ⚠️ | CC1.4 | Competence: hiring, onboarding, security training | organizational | document exists (compliance/policies/onboarding-offboarding-training.md) with 2 [CONFIRM] item(s) awaiting owner decision — not audit-ready until resolved |
| ✅ | CC1.5 | Accountability for internal-control responsibilities | organizational | document: compliance/policies/information-security-policy.md |

### CC2 Communication

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ⚠️ | CC2.1 | Relevant, quality information to support internal control | technical ← ID-01 ID-04 | ID-01 PASS: architecture docs: docs/architecture.md · ID-04 WARN: 5 personal-data column(s) detected; no written data inventory |
| ✅ | CC2.2 | Internal communication of objectives and responsibilities | organizational | CONTRIBUTING / SECURITY communicate expectations to contributors |
| ✅ | CC2.3 | External communication (privacy notice, disclosure channel, commitments) | technical ← GV-04 PV-01 | GV-04 PASS: disclosure instructions found in docs · PV-01 PASS: privacy page: compliance/policies/privacy-dsar-procedure.md |

### CC3 Risk assessment

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ⚠️ | CC3.1 | Objectives specified clearly enough to identify risks | organizational | document exists (compliance/policies/risk-management-policy.md) with 1 [CONFIRM] item(s) awaiting owner decision — not audit-ready until resolved |
| ⚠️ | CC3.2 | Risks identified and analyzed (risk register) | organizational | document exists (compliance/policies/risk-register.md) with 2 [CONFIRM] item(s) awaiting owner decision — not audit-ready until resolved |
| ✅ | CC3.3 | Fraud risk considered | organizational | covered by a section in existing docs |
| ✅ | CC3.4 | Changes that could affect internal control are identified | technical ← GV-03 PR-16 | GV-03 PASS: Dependabot alerts enabled, 0 open (+ dependabot.yml) · PR-16 PASS: versioned migrations: supabase/migrations |

### CC4 Monitoring

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ⚠️ | CC4.1 | Ongoing / separate evaluations of controls | technical ← GV-03 ID-03 PR-17 | GV-03 PASS: Dependabot alerts enabled, 0 open (+ dependabot.yml) · ID-03 WARN: npm audit produced no parseable output (offline?) · PR-17 PASS: SAST / secret scanning in CI |
| ⚠️ | CC4.2 | Deficiencies evaluated and communicated / tracked | organizational | no security-labelled issues — track scan findings as GitHub issues with a `security` label |

### CC5 Control activities

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ✅ | CC5.1 | Control activities selected to mitigate risk | organizational | control set declared in compliance/nist-scan.config.json |
| ⚠️ | CC5.2 | General controls over technology | technical ← PR-10 PR-11 PR-14 | PR-10 WARN: headers present: X-Frame-Options / frame-ancestors, X-Content-Type-Options, Referrer-Policy, Permissions-Policy; missing: Content-Security-Policy · PR-11 PASS: zod used in 5+ server file(s) · PR-14 PASS: CI gates: lint, typecheck, test, build (3 workflow(s)) |
| ✅ | CC5.3 | Controls deployed through policies and procedures | organizational | 21 policy/procedure docs |

### CC6 Logical & physical access

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ⚠️ | CC6.1 | Logical access security software, infrastructure, architectures | technical ← PR-01 PR-04 PR-06 PR-07 | PR-01 WARN: Supabase Auth, Clerk installed but no server-side session verification found · PR-04 PASS: 7 table(s), RLS enabled on all · PR-06 PASS: no credential literals detected in source |
| ⚠️ | CC6.2 | User registration, authorization, and de-provisioning | technical ← PR-01 PV-03 | PR-01 WARN: Supabase Auth, Clerk installed but no server-side session verification found · PV-03 WARN: retention/deletion mentioned in docs only · policy: document exists (compliance/policies/access-control-policy.md) with 5 [CONFIRM] item(s) awaiting owner decision — not audit-ready until resolved |
| ✅ | CC6.3 | Role-based access, least privilege, periodic review | technical ← PR-03 PR-05 | PR-03 PASS: 11 guarded server file(s); 0 unguarded mutating handlers · PR-05 PASS: no privileged keys in client code |
| ⚠️ | CC6.4 | Physical access (inherited from cloud provider) | organizational | document exists (compliance/policies/subprocessor-register.md) with 16 [CONFIRM] item(s) awaiting owner decision — not audit-ready until resolved |
| ⚠️ | CC6.5 | Disposal of data and assets | technical ← PV-03 | PV-03 WARN: retention/deletion mentioned in docs only |
| ✅ | CC6.6 | Boundary protection against external threats | technical ← PR-08 PR-12 PR-13 | PR-08 PASS: HSTS header set · PR-12 PASS: rate limiting implemented · PR-13 PASS: same-origin only (no CORS headers emitted) |
| ✅ | CC6.7 | Restrict transmission / movement of data | technical ← PR-08 PR-09 | PR-08 PASS: HSTS header set · PR-09 PASS: Supabase Postgres (AES-256 at rest, managed) |
| ✅ | CC6.8 | Prevent / detect unauthorized or malicious software | technical ← ID-02 PR-17 | ID-02 PASS: package-lock.json committed · PR-17 PASS: SAST / secret scanning in CI |

### CC7 System operations

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ⚠️ | CC7.1 | Detect configuration changes and new vulnerabilities | technical ← GV-03 ID-03 | GV-03 PASS: Dependabot alerts enabled, 0 open (+ dependabot.yml) · ID-03 WARN: npm audit produced no parseable output (offline?) |
| ⚠️ | CC7.2 | Monitor for anomalies and security events | technical ← DE-01 DE-02 | DE-01 PASS: Sentry, Vercel Analytics, Vercel Speed Insights · DE-02 WARN: partial audit trail (table or writer, not both) |
| ⚠️ | CC7.3 | Evaluate security events to determine incidents | technical ← DE-02 RS-01 | DE-02 WARN: partial audit trail (table or writer, not both) · RS-01 PASS: incident-response procedure documented |
| ✅ | CC7.4 | Respond to identified incidents | technical ← RS-01 RS-02 | RS-01 PASS: incident-response procedure documented · RS-02 PASS: breach-notification obligations documented |
| ✅ | CC7.5 | Recover from incidents | technical ← RC-01 | RC-01 PASS: backup / restore posture documented |

### CC8 Change management

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ⚠️ | CC8.1 | Authorize, design, test, approve, and implement changes | technical ← PR-14 PR-15 PR-16 | PR-14 PASS: CI gates: lint, typecheck, test, build (3 workflow(s)) · PR-15 PASS: main protected: PR reviews, status checks · PR-16 PASS: versioned migrations: supabase/migrations · policy: document exists (compliance/policies/change-management-sdlc-policy.md) with 1 [CONFIRM] item(s) awaiting owner decision — not audit-ready until resolved |

### CC9 Risk mitigation

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ⚠️ | CC9.1 | Mitigate risk of business disruption | technical ← RC-01 RC-02 | RC-01 PASS: backup / restore posture documented · RC-02 PASS: deploy config: vercel.json · policy: document exists (compliance/policies/business-continuity-dr-plan.md) with 6 [CONFIRM] item(s) awaiting owner decision — not audit-ready until resolved |
| ⚠️ | CC9.2 | Vendor and business-partner risk management | organizational | document exists (compliance/policies/subprocessor-register.md) with 16 [CONFIRM] item(s) awaiting owner decision — not audit-ready until resolved |

### A1 Availability

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ✅ | A1.1 | Capacity monitoring and management | technical ← DE-01 | DE-01 PASS: Sentry, Vercel Analytics, Vercel Speed Insights |
| ✅ | A1.2 | Environmental protections, backups, recovery infrastructure | technical ← RC-01 RC-02 | RC-01 PASS: backup / restore posture documented · RC-02 PASS: deploy config: vercel.json |
| ❌ | A1.3 | Recovery plan testing | organizational | document exists but the test has not been performed: compliance/policies/restore-test-log.md |

### C1 Confidentiality

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ⚠️ | C1.1 | Identify and maintain confidential information | technical ← ID-04 PR-04 | ID-04 WARN: 5 personal-data column(s) detected; no written data inventory · PR-04 PASS: 7 table(s), RLS enabled on all · policy: document: compliance/policies/data-classification-policy.md |
| ⚠️ | C1.2 | Dispose of confidential information | technical ← PV-03 | PV-03 WARN: retention/deletion mentioned in docs only · policy: document exists (compliance/policies/data-retention-disposal-policy.md) with 3 [CONFIRM] item(s) awaiting owner decision — not audit-ready until resolved |

### PI1 Processing integrity

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ✅ | PI1.1 | Definitions of data and processing are documented | technical ← ID-01 PR-16 | ID-01 PASS: architecture docs: docs/architecture.md · PR-16 PASS: versioned migrations: supabase/migrations |
| ✅ | PI1.2 | Inputs are complete, accurate, timely (validation) | technical ← PR-11 | PR-11 PASS: zod used in 5+ server file(s) |
| ✅ | PI1.3 | Processing is complete and accurate (tests) | technical ← PR-14 | PR-14 PASS: CI gates: lint, typecheck, test, build (3 workflow(s)) |
| ✅ | PI1.4 | Outputs are complete, accurate, and protected | technical ← DE-03 PR-05 | DE-03 PASS: no sensitive identifiers passed to console logging · PR-05 PASS: no privileged keys in client code |
| ✅ | PI1.5 | Stored data is complete and accurate (migrations, backups) | technical ← PR-16 RC-01 | PR-16 PASS: versioned migrations: supabase/migrations · RC-01 PASS: backup / restore posture documented |

### P1 Notice

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ✅ | P1.1 | Privacy notice provided | technical ← PV-01 | PV-01 PASS: privacy page: compliance/policies/privacy-dsar-procedure.md |

### P2 Choice & consent

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ✅ | P2.1 | Choice and consent obtained | technical ← PV-02 | PV-02 PASS: consent / opt-out handled |

### P3 Collection

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ⚠️ | P3.1 | Collection limited to what the notice states | technical ← ID-04 PV-04 | ID-04 WARN: 5 personal-data column(s) detected; no written data inventory · PV-04 PASS: no third-party trackers |

### P4 Use, retention, disposal

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ⚠️ | P4.1 | Use limited to identified purposes; retention; disposal | technical ← PV-03 | PV-03 WARN: retention/deletion mentioned in docs only |

### P5 Access

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ✅ | P5.1 | Data-subject access and correction | organizational | data export / DSAR path |

### P6 Disclosure

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ⚠️ | P6.1 | Disclosure to third parties limited and tracked (subprocessors) | organizational | document exists (compliance/policies/subprocessor-register.md) with 16 [CONFIRM] item(s) awaiting owner decision — not audit-ready until resolved |

### P7 Quality

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ✅ | P7.1 | Personal data accurate and complete | technical ← PR-11 | PR-11 PASS: zod used in 5+ server file(s) |

### P8 Monitoring

| | TSC | Criterion | Type | Evidence / gap |
|---|---|---|---|---|
| ✅ | P8.1 | Privacy complaints and breach notification | technical ← RS-02 GV-04 | RS-02 PASS: breach-notification obligations documented · GV-04 PASS: disclosure instructions found in docs |
