# Claude Certification Track — onboarding workflow

Config: `src/lib/certification.ts`. Intake form: `/certification/intake`
(`?path=associate` preselects the associate path). Email copy:
[`templates.md`](./templates.md).

## The two paths

| | Certification Sprint (paid) | JMCB Associate (invited) |
|---|---|---|
| Who | Anyone, usually cohort members | People Jermaine invites to do real JMCB work |
| They pay | Sprint fee (training + coaching) + $125 exam fee to Anthropic | $125 exam fee to Anthropic |
| JMCB pays | — | Their jmcbtech.com address |
| jmcbtech.com address | **No** | Yes, after the agreement is signed |
| Exam registered under | Their own employer, if it is a Claude partner | JMCB |

**Hard rule:** the Sprint fee buys training. It never buys a jmcbtech.com
address or exam access. Anthropic certifies people *at* partner organisations;
selling addresses for exam access puts JMCB's partner standing at risk. A
Sprint participant who wants to sit under JMCB becomes an Associate first,
with real work.

**Sprint participants whose employer is not a partner:** their employer can
register with the Claude Partner Network for free and they sit under the
employer's domain. If that is not possible, tell them before they pay.
Otherwise they are paying for prep for an exam they cannot book.

## Stages

Track each person in the cohort roster tracker. `leads.status` only allows
new, contacted, qualified, converted and unqualified, so the stage lives in the
tracker, not the database.

| # | Stage | Done when | Template | Who |
|---|---|---|---|---|
| 1 | Invited | Invite sent | 1A / 1S | Jermaine |
| 2 | Intake received | Form submitted (lands in `leads`, source `certification_intake`) and the notification email arrives | auto | Candidate |
| 3 | Committed | **Associate:** agreement signed. **Sprint:** fee paid | 3A / 3S | Both |
| 4 | Account set up | **Associate:** jmcbtech.com address issued and tested. **Sprint:** employer-partner route confirmed | 4A / 4S | Jermaine |
| 5 | Registered | Partner Academy account on the partner-domain address (never Gmail) | 4A / 4S | Candidate |
| 6 | Exam booked | Date about 2 weeks out; study plan sent | 5 | Candidate |
| 7 | Studying | Check-ins sent in week 1 and week 2 | 6 (text) | Jermaine |
| 8 | Result | Pass → credential logged, expiry +12 months. Not yet → retake date (14-day wait) | 7P / 7R | Both |
| 9 | Active | **Associate:** first real work assigned the same week | — | Jermaine |

## Account setup checklist (Associates)

1. Test first: a **forwarding address** (M365 distribution list or mail
   contact that forwards to their personal inbox) costs nothing. Register one
   at Partner Academy and confirm the verification email arrives. If it does,
   use forwarders. If it does not, issue a full mailbox.
2. Create the address as `first.last@jmcbtech.com` (or the intake request, if
   it is sensible).
3. Record the address, date issued and cost in the tracker.
4. Offboarding (from the agreement): when the associate relationship ends,
   remove the address within 7 days.

## Data collected at intake

Legal name (the exam is proctored), personal email, **cell phone (required)**,
permission to text, preferred contact channel, location, time zone,
organisation and role, LinkedIn, GitHub, exam, target date, experience,
hours per week, goal, and for Associates a requested address. The programme
application form now requires a cell phone too.

## Open decisions (Jermaine)

- **Sprint fee.** Proposed $250 for 2 weeks of prep plus 2 months of coaching
  access. Set it in template 3S before sending any.
- Payment link: a Stripe Payment Link for the fee (not created yet).
- Associate agreement document (scope, hours, confidentiality, IP, offboarding): not drafted yet.
