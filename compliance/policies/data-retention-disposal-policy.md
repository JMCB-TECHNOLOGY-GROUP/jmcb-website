# Data Retention and Disposal Policy

**Owner:** Jermaine F. Barker · **Effective:** 2026-08-26 · **Review:** annual

## Principle
Keep data only as long as it serves the purpose it was collected for or as long as law requires; dispose of it securely and verifiably afterwards. Retention periods are defined per platform and data class; deletion is implemented in code where users can trigger it and by scheduled job where it is time-based.

## Retention schedule
| Platform | Data | Retention | Basis | Disposal |
|---|---|---|---|---|
| TendivoHealth | patient records (PHI) | per covered-entity client contract; default **6 years** from last activity (HIPAA §164.316(b)(2) documentation rule; state medical-record laws may be longer) | HIPAA / client BAA | client-directed export then hard delete; Supabase backups age out ≤ 7 days after |
| TendivoHealth | audit logs of PHI access | 6 years | HIPAA §164.316 | archive then delete |
| CaughtUp | taxpayer documents & returns | user-controlled; default 3 years after last filing season, then delete unless user extends | IRC §6501 SOL; §7216 minimisation | user delete → hard delete + storage purge; account deletion removes everything within 30 days |
| CaughtUp | account/billing records | 7 years | tax/accounting | archive |
| Runwei Provider Portal | provider profiles, applications | life of account + 2 years | contract | account deletion route |
| Polintel 21CC | SMS enrollments, consent, send log | consent + send log **4 years** after opt-out | TCPA record-keeping | scheduled purge `[CONFIRM: implement]` |
| MarineOps / KokerWatch | vessel, certificate, drainage records | client-directed; default 5 years | regulator practice | export then delete |
| ASCEND | social OAuth tokens, drafts, published content | tokens until disconnect; content life of account | service | disconnect revokes; account delete purges |
| Civic (DPR), Conferences | participant registrations | event/season + 1 year | operational | scheduled purge `[CONFIRM]` |
| Website, 60 Women, Guyana Inspired, Roianne | lead / form submissions | 2 years | marketing | manual purge at annual review |
| All | server/app logs, Sentry events | 30–90 days (vendor default) | operational | vendor auto-expiry |
| All | backups | 7 days rolling (Supabase); PITR window per plan | recovery | vendor auto-expiry |
| Company | contracts, invoices, tax records | 7 years | legal/tax | archive |
| Company | training, access reviews, incident reports | 3 years (incident reports 6 years if HIPAA) | SOC 2 / HIPAA evidence | archive |

## Disposal methods
- **Database rows:** hard delete (not soft-delete) once retention lapses; cascading deletes defined in schema; verify with a row count.
- **Storage objects:** delete via API; confirm 404.
- **Backups:** rely on vendor rolling expiry; restores after a deletion must re-apply deletions (deletion ledger `[CONFIRM: implement for Tendivo/CaughtUp]`).
- **Devices / media:** full-disk encryption throughout life; wipe (crypto-erase) on retirement; record in offboarding checklist.
- **Paper:** cross-cut shred.

## User-initiated deletion
Every platform with accounts provides account deletion (Privacy & DSAR Procedure §4). Tier-1 platforms complete it within 30 days and confirm by email.

## Records
Disposal actions affecting Restricted data are logged (who, what, when, method) in the platform audit table or the compliance folder.
