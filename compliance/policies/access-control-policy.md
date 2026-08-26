# Access Control Policy

**Owner:** Jermaine F. Barker · **Effective:** 2026-08-26 · **Review:** annual

## 1. Principles
Least privilege, need-to-know, named accounts, MFA everywhere it is offered, and periodic review. Applies to every system in the Subprocessor Register and to every platform database.

## 2. Provisioning
- Access is requested by the owner as part of onboarding and granted at the lowest role that lets the person do the work (GitHub: `write` on the specific repo, never org `owner`; Supabase: project *Developer*, never *Owner*; Vercel/Netlify: *Member*).
- Production database credentials (service-role keys, direct Postgres) are **owner-only** and are used only by server-side code via environment stores.
- Interns receive sandbox / preview access only.

## 3. Authentication
- MFA is mandatory on GitHub, Supabase, Vercel, Netlify, Stripe, Twilio, Google Workspace, Microsoft 365.
- Platform end-users: Supabase Auth (or the platform's provider) with email verification; TOTP MFA is **required** for CaughtUp once server-side storage ships (GLBA 314.4(c)(5)) and for all admin roles on Tier-1 platforms `[CONFIRM: enforce AAL2 in middleware]`.
- Session timeouts: admin sessions ≤ 12 h; TendivoHealth clinical sessions auto-logoff after 15 min idle (HIPAA §164.312(a)(2)(iii)).

## 4. Authorization model
- Every API route / server action verifies identity **and** role server-side. Client-side gating is cosmetic.
- Supabase: Row Level Security enabled on every table; `anon`/`authenticated` grants limited to what the UI needs; service role never shipped to a browser (scanner PR-04, PR-05 enforce).
- Roles per platform are documented in that repo's README / architecture doc.

## 5. Review and de-provisioning
- **Quarterly access review** (Feb / May / Aug / Nov): owner exports org members, repo collaborators, Supabase and Vercel team lists, and admin-role users per platform; confirms each is still required; removes the rest. Record kept as `access-review-YYYY-MM.md` `[CONFIRM location: Documents\JMCB\Compliance\Access]`.
- **Offboarding** within 24 hours per the Onboarding/Offboarding policy; shared secrets rotated.
- **Access register:** a single list of who has what, maintained by the owner and updated on every grant or removal.

## 6. Privileged access
Owner-only: org admin, billing, DNS, production secrets. Recovery codes stored offline in a sealed location with an emergency contact who can reach them `[CONFIRM]` (Risk R-04).

## 7. Monitoring
Auth events are logged by the identity provider; admin actions on Tier-1 platforms are written to an application audit table (scanner DE-02). Anomalies are handled under the Incident Response Plan.
