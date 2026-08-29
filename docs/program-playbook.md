# Proof of Work — Facilitator Playbook

Everything needed to actually run a cohort. The public-facing copy lives at
`/program`; the data behind both that page and this document lives in
`src/lib/program.ts`. **Change a date or a project there, not here** — this
playbook explains how to teach it, the code holds what it is.

- **Cadence:** Thursdays, 7:00–8:30pm ET, eight consecutive weeks
- **Cohort 1:** 1 October – 19 November 2026 (info session 17 September, applications close 24 September)
- **Size:** 40 places on the free core track, 12 on the paid capstone
- **Facilitator load:** ~6 hrs/week (90 min live, ~3 hrs feedback, ~90 min prep)

---

## 1. Why this is shaped the way it is

Three design decisions carry the whole programme. Do not quietly drop them
when a cohort gets busy — everything else is negotiable.

**One task, eight weeks.** In week 1 every participant names a real recurring
task they personally own. All eight projects attach to it. This is what makes
the difference between eight disconnected exercises and one portfolio, and
it is why the application form's task question is the one that decides
admission. An applicant with no real task cannot do this programme; be honest
with them rather than admitting them to struggle.

**A baseline and a result, as numbers.** Week 1 measures the task. Week 5
measures it again. Without that pair, a graduate can only say they "learned
about AI". With it, they can say they took a 40-minute weekly task down to
6 minutes and show the working. That sentence is the product.

**Limits are graded, not tolerated.** Week 3 is a red-team week and every
later rubric asks what the work cannot do. Most programmes teach people to
demo. The scarce skill — and the one that makes a participant safe to hire —
is knowing and stating where it breaks.

---

## 2. The weekly run sheet

Every session uses the same 90-minute shape. Participants should be able to
predict it by week 3; the predictability is what lets them arrive ready.

| Time | Block | What happens |
|---|---|---|
| 0:00–0:10 | **Ship report** | Three volunteers show last week's project in 2 min each. Not polished. Not optional to watch. |
| 0:10–0:35 | **Teach** | One concept, taught against a real example. Never more than one. |
| 0:35–1:05 | **Build together** | Facilitator builds live, narrating dead ends. Participants follow on their own task. |
| 1:05–1:20 | **Breakout pairs** | Build partners swap screens and try to break each other's work. |
| 1:20–1:30 | **Brief and close** | Next project handed out, rubric read aloud, deadline restated. |

**Rules that make it work**

- Cameras optional, participation not. Everyone types in chat at least twice.
- The live build must include something going wrong. If it all works, show a
  failure on purpose — that is the most valuable ten minutes of the night.
- Never run over. Ending on time every week is what keeps attendance at week 7.
- Record the teach and build blocks only. Breakouts stay unrecorded so people
  will actually talk.

**Between sessions**

- Projects are due Wednesday 11:59pm ET — the night before the next session,
  so you can read them before you teach.
- Written feedback on every submission, against the published rubric, by
  Thursday afternoon. Two things that worked, one thing to fix, one question.
- Anyone who misses two consecutive submissions gets a personal email, not a
  drop. Most of them come back.

---

## 3. Project briefs and rubrics

The briefs as participants see them are in `src/lib/program.ts` (`WEEKS`) and
render on `/program`. Below is what each week needs from *you* — what to teach,
what goes wrong, and how to mark it.

### Week 1 — The Problem Brief
**Teach:** how to describe a problem without naming a solution. Cost, frequency,
who is affected, what better looks like as a number.
**Live build:** take a volunteer's vague task and interrogate it into a brief on
screen. This models the whole programme.
**Failure mode:** people pick something impressive rather than something real,
or something they do once a quarter. Push hard on *weekly* and *you personally*.
**Mark on:** a real recurring task the participant owns; a measured baseline
(minutes per run, runs per week, who is affected); a success measure stated as a
number; one page.

### Week 2 — The Reusable Prompt
**Teach:** prompt as a spec — role, input, output structure, constraints,
examples. Rubrics before results. Versioning.
**Live build:** write one prompt, run it three times, show the variance, then fix
the prompt rather than the output.
**Failure mode:** treating it as chat. If they cannot hand it to someone else and
get comparable quality, it is not done.
**Mark on:** parameterised and reusable; output structure specified and
consistently produced; five real runs scored against their own rubric; failure
modes documented, including one they did not expect.

### Week 3 — The Red-Team Report
**Teach:** hallucination, confident error, edge cases, and the privacy question
nobody asks — what data did you paste in, and were you allowed to?
**Live build:** attack the week 2 prompt from the live build until it fabricates.
It will.
**Failure mode:** participants report weaknesses they guessed at. Insist on
reproduced failures with the input that caused them.
**Mark on:** three concrete reproduced failures; a privacy pass on the inputs; a
stated "do not use this for…" boundary; a disclosure line a real recipient would
understand.

### Week 4 — The One-Chart Answer
**Teach:** getting from a messy public file to one defensible claim. Axis honesty,
titles that state the finding, and what data cannot show.
**Live build:** open a genuinely messy public CSV cold and clean it on screen.
**Failure mode:** three charts and no answer. One question, one chart.
**Mark on:** real public data with a working source link; one question and one
chart with an honest axis; repeatable cleaning steps; three caveats named and
addressed.
**Have ready:** two or three public datasets relevant to your cohort's region for
anyone whose own task has no data attached.

### Week 5 — The Automation
**Teach:** choosing the tool their workplace actually permits, and designing for
the malformed input rather than the happy path.
**Live build:** wire a real end-to-end automation, including the part where it
fails on bad input and you handle it.
**Failure mode:** a demo that only runs when the facilitator is watching. It must
run on real input, unattended.
**Mark on:** runs end to end on real input, demonstrated live; before-and-after
timing against week 1; failure handling for malformed input; written steps
someone else could follow.
**Watch for:** locked-down corporate environments. Have a fallback stack ready so
nobody is blocked by IT.

### Week 6 — The Assistant
**Teach:** tools as an interface, human-in-the-loop before anything consequential,
and evaluation as a written test set rather than a vibe.
**Live build:** an assistant with two tools and an approval gate, then run the
eval set and show a real pass rate — including the failures.
**Failure mode:** an agent with no approval gate that can send or delete
something. Do not pass it.
**Mark on:** two or more working tools against something real; an explicit
human-in-the-loop step; ten written test cases with recorded results; the
participant can explain their failures.

### Week 7 — The Two-Minute Demo
**Teach:** leading with the result; cutting jargon; the one-page memo that ends in
a specific ask.
**Live build:** record a two-minute demo live, badly, then cut it to time in front
of everyone.
**Failure mode:** four minutes of architecture before the result. Enforce the two
minutes strictly — it is the lesson.
**Mark on:** under two minutes and understandable to a non-technical viewer;
leads with the result; a one-page memo ending in a recommendation and an ask;
cost and limits stated.

### Week 8 — The Portfolio Page and graduation
**Teach:** publishing the evidence. Structure: problem, baseline, what you built,
measured result, limits.
**Session shape:** this week is graduation. Five minutes per participant, badges
announced, invited guests welcome. Skip the normal run sheet.
**Mark on:** publicly reachable at a link they control; baseline and result as
numbers; a limits section; presented live in five minutes or less.
**Do:** record the graduation with permission, and write up cohort outcomes.
That record is what makes the next cohort, and the private-cohort offer on
`/training`, credible.

---

## 4. Admissions

Read applications against the task answer first and everything else second.

**Accept** when the named task is real, recurring, owned by the applicant, and
specific enough to measure. Career stage, sector and technical background are
not selection criteria — a care assistant with a weekly rota problem is a
stronger admit than a developer with a hypothetical one.

**Write back before rejecting** when the task is vague ("lots of admin") or
clearly one-off. One email asking them to name something specific converts most
of them into good admits.

**Decline** when there is no task at all, or the applicant cannot make Thursday
evenings. Say why, plainly, and tell them when the next cohort opens.

Aim for a mix of sectors — cross-sector breakout pairs consistently produce
better week 3 red-teaming than same-sector ones.

---

## 5. Email sequence

Seven emails carry a cohort. The application confirmation is already automated
in `src/app/api/program/apply/route.ts`; the rest are sent by hand.

| # | When | Subject | Job it does |
|---|---|---|---|
| 1 | On application *(automated)* | Your Proof of Work application is in | Confirms receipt, gives the four key dates, tells them to start timing their task |
| 2 | Info session −3 days | Questions about Proof of Work? Thursday, 7pm | Drives info-session attendance; include the join link |
| 3 | Applications close −3 days | Applications close Thursday | The deadline nudge; historically the largest single source of applications |
| 4 | Decision day | You're in — Proof of Work starts 1 October | Welcome pack: dates, the four-hour expectation, the pre-work (time your task), the cohort channel invite |
| 4b | Decision day | About your Proof of Work application | The decline. Specific reason, next cohort date, a link to something useful |
| 5 | Week 1 −1 day | Tomorrow, 7pm — bring your task | Cuts week 1 no-shows; restate the one thing to bring |
| 6 | Weekly, Fridays | Week *N*: what you shipped, what's next | Ship report, two examples of good work (with permission), the deadline |
| 7 | Week 8 +2 days | Your badge, your page, and what's next | Badge delivery, portfolio links, capstone applications, and the ask for a testimonial |

Keep every email short enough to read on a phone at a bus stop. The weekly
Friday email is the one that holds retention — never skip it, even in a quiet week.

---

## 6. Capstone (paid track)

Applied for after week 6, runs after graduation, capped at twelve. Five further
Thursday sessions with a break over the holidays.

The capstone sells on portfolio depth, coaching and employer exposure —
**not** on exam or certification preparation. That offer is gated until JMCB
itself holds the practitioner certifications, the same rule the `/training`
page follows. Keep the two consistent; if that gate lifts, update both.

Demo Day is the point of the track. Invite association partners, employers and
anyone who has ever asked you for "someone who knows AI". Twelve people
presenting measured results is a better business development event than any
webinar.

---

## 7. Running the second cohort

1. Edit `COHORT` and `SESSION_DATES` in `src/lib/program.ts`. Nothing else needs
   to move — `npm test` will fail loudly if a date is not a Thursday or the
   sessions are not a week apart.
2. Update the cohort label and seat count in the same block.
3. Re-read the previous cohort's week 5 and week 6 submissions before teaching
   them again. The failure modes shift as the tooling shifts.
4. Publish the previous cohort's outcomes before applications open. Evidence
   from cohort *N* is what fills cohort *N+1*.
