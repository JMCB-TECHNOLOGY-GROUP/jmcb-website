# Privacy Program and Data-Subject Request (DSAR) Procedure

**Owner / Privacy Officer:** Jermaine F. Barker · **Effective:** 2026-08-26 · **Review:** annual

## 1. Notice (P1)
Every platform that collects personal data publishes a privacy notice at `/privacy` covering: what is collected, purpose, legal basis where applicable, retention (Retention Policy), subprocessors (§2), rights and how to exercise them (§4), contact, breach-notification commitment. Marketing-only sites publish a short notice. The scanner (`PV-01`) checks the page exists.

## 2. Subprocessor disclosure (P6)
The platform-specific rows of the Subprocessor Register are listed in the notice. Changes are posted ≥ 14 days before a new subprocessor receives Confidential data.

## 3. Choice and consent (P2, P3)
- Collection is limited to what the notice states; forms collect the minimum.
- Marketing email/SMS requires opt-in; every message carries unsubscribe / STOP; opt-outs are honoured within 10 days (email) or immediately (SMS).
- CaughtUp: any use of tax-return information beyond preparation assistance requires IRC §7216 consent in the prescribed format (Rev. Proc. 2013-14) — by default, none is sought and none is done.
- TendivoHealth: PHI is processed under the covered entity's authority and BAA; JMCB does not obtain patient consent directly.

## 4. Data-subject requests (P5)
| Right | How received | Verification | Deadline | Fulfilment |
|---|---|---|---|---|
| Access / export | in-app "Download my data" where built; else email privacy@ `[CONFIRM alias]` / jermaine@jmcbtech.com | logged-in session, or email loop to the account address | 30 days (extendable 30 with notice) | JSON/CSV export of the user's rows across tables holding their ID |
| Correction | in-app profile edit; else email | same | 30 days | update rows; note in audit log |
| Deletion | in-app account deletion; else email | same | 30 days | hard delete per Retention Policy; confirm by email; deletion ledger for backup re-apply |
| Restriction / objection | email | same | 30 days | flag account; stop processing except storage |
| Complaint | email | — | acknowledge 5 days | log, investigate, respond; escalate per §5 |

HIPAA requests (access, amendment, accounting of disclosures) from patients are routed to the covered-entity client within 5 business days; JMCB assists as BA per the BAA.

## 5. Complaints and monitoring (P8)
Privacy complaints are logged as GitHub issues labelled `privacy` (private repo) with the request date and outcome. Reviewed at the monthly governance review. Breaches involving personal data follow the Incident Response Plan §4.

## 6. Quality (P7)
Users can view and correct their own data; server-side validation rejects malformed identifiers; scheduled jobs do not alter user-entered values.

## 7. Records
DSAR log (date received, type, verified, completed, by whom) retained 3 years.
