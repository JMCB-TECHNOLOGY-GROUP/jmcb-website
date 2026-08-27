# Onboarding, Offboarding and Security Awareness Training Policy

**Owner:** Jermaine F. Barker · **Effective:** 2026-08-26 · **Review:** annual

## 1. Competence and screening
- Contractors and interns are engaged for defined scopes with skills verified by prior work, references, or interview. Background checks are required before access to Restricted data (TendivoHealth PHI, CaughtUp taxpayer records) `[CONFIRM: screening provider]`.
- Interns (e.g., SYCEP) are limited to Internal-class data and sandbox environments unless the owner grants an exception in writing.

## 2. Onboarding checklist (owner completes before access is granted)
- [ ] Signed engagement agreement with confidentiality terms
- [ ] Code of Conduct acknowledged
- [ ] Security awareness training completed (§4)
- [ ] Named GitHub account added to the JMCB org with the minimum team/role
- [ ] MFA verified on GitHub, Supabase, Vercel/Netlify as applicable
- [ ] Access recorded in the access register (Access Control Policy §5)

## 3. Offboarding checklist (within 24 hours of engagement end or termination)
- [ ] GitHub org membership and repo collaborator access removed
- [ ] Supabase, Vercel, Netlify, Stripe, Twilio, Resend, Sentry team access removed
- [ ] Shared secrets the person could see are rotated
- [ ] Devices holding JMCB data wiped or data returned; confirmation recorded
- [ ] Access register updated with removal date

## 4. Security awareness training
- **When:** on onboarding and annually every August; ad-hoc after any incident.
- **Content:** phishing and social engineering; secrets handling; data classification and the per-platform rules (HIPAA minimum necessary, §7216, PCI no-card-data); incident reporting; secure coding basics (input validation, authorization on every route, RLS).
- **Format:** JMCB's own 45-minute session or an approved course; completion recorded with name and date.
- **Owner:** completes the same training and maintains currency through AI-security and cloud-security certifications on record.

## 5. Records
Training completions, acknowledgments, and onboarding/offboarding checklists are retained 3 years in `Documents\JMCB\Compliance\People` `[CONFIRM location]`.
