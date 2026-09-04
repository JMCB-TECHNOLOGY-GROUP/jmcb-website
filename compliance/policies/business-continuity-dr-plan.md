# Business Continuity and Disaster Recovery Plan

**Owner:** Jermaine F. Barker · **Effective:** 2026-08-26 · **Review:** annual · **Test:** annual restore test (Restore Test Log)

## 1. Objectives by tier
| Tier | Platforms | RTO | RPO | Basis |
|---|---|---|---|---|
| 1 | TendivoHealth, CaughtUp, Runwei Provider Portal | 8 h | 24 h (Supabase daily backup) — **target 1 h with PITR** `[CONFIRM: PITR add-on on Tendivo project]` | clinical / financial records |
| 2 | Polintel, MarineOps, ASCEND, Civic, Conferences, Runwei WWW/Admin, HoopTrack, ChairTime | 24 h | 24 h | operational |
| 3 | marketing / static / tooling | 72 h | git (no DB) or 24 h | replaceable |

## 2. Threat scenarios
Region outage at Supabase or Vercel; accidental destructive migration; ransomware / compromised owner account; loss of the owner's devices; domain/DNS loss; key-person unavailability (single principal — Risk R-04).

## 3. Backups
- **Database:** Supabase automated daily backups (Pro) retained 7 days; PITR where enabled. Runwei Provider Portal Postgres host `[CONFIRM: provider + backup policy]`.
- **Code and config:** GitHub (org) is the system of record; every deploy is reproducible from the repo + platform env vars. Env vars are exported quarterly to an encrypted offline store `[CONFIRM: location]`.
- **Files / storage buckets:** Supabase Storage is included in project backups `[CONFIRM per project]`.
- **Documents:** company docs in Google Drive / OneDrive with version history.

## 4. Recovery procedures
1. **Database restore:** Supabase dashboard → Backups → restore to point/daily; or `pg_restore` of the downloaded dump into a new project; update `SUPABASE_URL`/keys in Vercel; redeploy.
2. **Platform rebuild:** create Vercel/Netlify project from the GitHub repo; set env vars from the offline store; point DNS; verify with the platform's smoke checklist.
3. **Compromised account:** rotate all keys (IR Plan §3), revoke sessions, restore DB to pre-compromise point if integrity is in doubt.
4. **DNS loss:** registrar recovery (GoDaddy / Cloudflare) using owner credentials in the sealed recovery kit.
5. **Key-person:** emergency contact `[CONFIRM]` holds sealed recovery codes and this plan; clients notified per contract.

## 5. Communication
Status to clients within 2 h of a Tier-1 outage (email from jermaine@jmcbtech.com); public status page not maintained `[CONFIRM: acceptable?]`.

## 6. Testing
Annual restore test per Tier-1 platform, recorded in `restore-test-log.md`. First test due **2026-09-30**. Any failure becomes a Risk Register item.
