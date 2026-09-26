# Proof of Work Lab: student workflow

The Lab is the cohort LMS.
- **Students** use a private portal at `/lab/<token>`. The link is their login, so keep it private. It stays out of search and is disallowed in robots.
- **Jermaine** runs everything from `/admin/lab`, signed in with `ADMIN_PASSWORD`.
- **Data** lives in two tables: `lab_students` and `lab_submissions` (migration `supabase/migrations/0003_lab.sql`). Both are service-role only.
- **Lesson content** is in `src/lib/lab-curriculum.ts`, and the facilitator notes are in [`facilitator-talking-points.md`](./facilitator-talking-points.md).

## Admin loop

1. **Import applicants.** `/admin/lab` → "Import applicants" copies every `program_application` lead into the roster once. The real task is copied too. Running it again adds only new applicants.
2. **Invite.** "Invite" emails the student a new portal link. "Link only" makes a link to text instead. Either one kills the previous link, which is how a leaked link gets revoked.
3. **Watch the tiles.** Each step shows how many students have finished it.
4. **Payment.** Card payments through Stripe Checkout confirm themselves. For Zelle, cash or a waived fee, open the student and use "Mark paid" with a reference.
5. **Addresses.** When a student requests an address, you get an email. Create the mailbox (or test a free forwarder first), then "Record issued address".
6. **Weekly.** Students submit each week's work. The Work column shows what's waiting for review. Feedback you type appears in the student's portal.

## Student steps (in order)

| # | Step | Done when | Gate |
|---|---|---|---|
| 1 | Contact details | Cell phone and time zone confirmed, plus text permission and preferred channel. **Required for everyone**, including students whose application already had a phone | — |
| 2 | GitHub account | Username checked against the GitHub API | — |
| 3 | Introduce yourself | Intro saved (visible to classmates) | — |
| 4 | Target role | Role, 3 current postings, and the skills repeated across them | — |
| 5 | Route | Power Platform Developer (AB-400, replacing PL-400 from 16 Oct) or Claude Architect chosen, with a reason. Five questions suggest a route, but the student decides | — |
| 6 | Pay track fee | Stripe Checkout paid, or marked paid by admin | Route chosen; `LAB_TRACK_FEE_CENTS` set |
| 7 | Associate terms | Accepted by typing their legal name | Paid |
| 8 | jmcbtech.com address | Issued by Jermaine | Terms accepted |

## Settings

- `LAB_TRACK_FEE_CENTS`: the track fee, for example `25000` for $250. **While it's unset, the payment step says the fee is being finalised and no checkout appears.** Set it in Vercel (Production), then redeploy.
- `STRIPE_SECRET_KEY`: already set. Checkout sessions carry `metadata.lab_student_id`, and the payment is verified when the student returns to the portal. No webhook is needed.

## Rules

- **The jmcbtech.com address is tied to the associate terms and real JMCB project work.** It is never sold on its own as a way to get exam access. Anthropic certifies people *at* partner organisations.
- **PL-400 students don't need a jmcbtech.com address to sit their exam.** They get one only because they're doing JMCB project work.
- **The associate terms in `src/lib/lab-shared.ts` (`ASSOCIATE_TERMS`) are a DRAFT.** Review them before the first student reaches step 6.
- **Unpaid associates work on cohort and training builds.** Any paid client work is agreed in writing first.
