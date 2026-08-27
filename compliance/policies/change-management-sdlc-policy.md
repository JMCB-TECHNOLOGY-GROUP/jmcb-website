# Change Management and Secure Development (SDLC) Policy

**Owner:** Jermaine F. Barker · **Effective:** 2026-08-26 · **Review:** annual

## 1. Scope
All code, infrastructure configuration, database schema, and third-party integration changes to any JMCB platform, whether authored by a person or an AI coding agent.

## 2. The path to production
1. **Branch** — work happens on a feature branch; the default branch is protected (PR required, status checks required, no force-push) `[CONFIRM: rulesets enabled on Tier-1/2 — Risk R-03]`.
2. **Pull request** — every change is a PR with a description of *what* and *why*, linked issue where one exists, and the PR template's security checklist completed (auth on new routes, RLS on new tables, no secrets, PII handling).
3. **Automated gates** — CI must pass: lint, typecheck, tests, build, `npm audit`, and the NIST/SOC 2 scanner. A failing gate blocks merge.
4. **Peer review** — at least one review. In a single-engineer context the compensating control is: the reviewer is a *different session or agent* from the author, the scanner evidence is attached, and the owner performs the merge. Tier-1 platforms additionally require the owner to review any change touching auth, RLS, payments, or PHI/taxpayer data.
5. **Deploy** — merges to the default branch deploy automatically (Vercel / Netlify git integration). Preview deployments are used for verification before merge; proof of working behaviour (screenshot or test output) is attached to the PR (JMCB proof-of-work rule).
6. **Rollback** — Vercel/Netlify instant rollback to the previous deployment; database migrations are forward-only with a written down-path in the PR when destructive.

## 3. Database changes
Schema changes are versioned migrations under `supabase/migrations` (or the ORM's migration folder), reviewed in the PR, applied to preview/branch databases first, then production. Direct production SQL is an exception requiring owner approval and a follow-up migration commit.

## 4. Secure coding standards
- Validate all inputs at the server boundary (zod or equivalent).
- Authorize on every server route / action; never rely on client gating.
- RLS on every table; service-role key server-side only.
- No secrets in code; `.env*` git-ignored; secrets in platform stores.
- No PII in logs; Sentry with `sendDefaultPii:false`.
- Security headers set at the framework/platform layer (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy).
- Dependencies pinned via lockfile; high/critical vulns fixed within 14 days on Tier-1/2.

## 5. Emergency changes
Security hot-fixes may merge on owner approval with CI passing; the PR is labelled `emergency` and reviewed retrospectively at the next governance review.

## 6. AI-generated changes
Agents follow the same path: branch → PR → gates → human merge. Agent sessions must not hold production service-role credentials. Every agent-authored commit carries the `Co-Authored-By` trailer for traceability.

## 7. Records
Git history, PR reviews, CI runs, and deployment logs are the change records; retained for the life of the repo.
