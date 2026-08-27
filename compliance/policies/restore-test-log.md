# Backup Restore Test Log

Evidence for SOC 2 A1.3 / NIST RC.RP-01. One entry per test. A test is "passed" only if the restored copy serves the application and a row-count / checksum comparison matches the source within RPO.

| Date | Platform | Backup source | Method | Restored to | Duration | Verification | Result | Tester | Follow-up |
|---|---|---|---|---|---|---|---|---|---|
| 2026-09-30 (scheduled) | TendivoHealth | Supabase daily backup | dashboard restore → new project | staging project | — | row counts on patients/observations; app login + patient list | PENDING | JFB | first test; confirm PITR |
| 2026-09-30 (scheduled) | CaughtUp | Supabase daily backup | pg_restore of downloaded dump | local Postgres | — | row counts; app smoke | PENDING | JFB | |
| 2026-09-30 (scheduled) | Runwei Provider Portal | `[CONFIRM host]` | provider snapshot | staging | — | drizzle migrations status; provider list | PENDING | JFB | |

No restore test has been performed as of 2026-08-26. This is an open finding (SOC 2 A1.3) until the first row above is completed.
