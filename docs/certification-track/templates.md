# Claude Certification Track — email and text templates

Workflow and stage numbers: [`workflow.md`](./workflow.md). Send everything
from jermaine@jmcbtech.com. Replace every `{{…}}` placeholder before sending.

Intake links:
- Associate: `https://www.jmcbtech.com/certification/intake?path=associate`
- Sprint: `https://www.jmcbtech.com/certification/intake`

---

## 1A — Associate invitation

**Subject:** A separate track: certification, training, and a seat on the JMCB bench

> {{first_name}},
>
> Separate from the cohort, I'd like to bring you in as a JMCB Associate. That means three things:
>
> - **Certification.** Claude Certified Developer, Foundations first, in two weeks of evenings on a study plan built around your own work. The exam fee is $125, paid on your own card when you book. Anthropic doesn't do vouchers. The Architect certifications come after that.
> - **Personal training.** One-on-one sessions with me alongside the cohort, focused on production builds, not only exam prep.
> - **The bench.** Real JMCB project work with me, and first call when a client build needs another pair of hands.
>
> JMCB covers your jmcbtech.com address, which is what lets you register for the exam. Anthropic only certifies people at partner firms.
>
> First step, five minutes: {{associate_intake_link}}
>
> Once that's in, I'll send the associate agreement.
>
> Jermaine

## 1S — Sprint invitation (paid)

**Subject:** Get Claude certified in two weeks

> {{first_name}},
>
> Some of you have asked about the Claude certification itself, not just the skills. I'm running a two-week **Certification Sprint** for that:
>
> - A study plan mapped to your own work, not generic exercises
> - Coaching sessions with me, with access for two months so a retake is covered too
> - The exam booked for about two weeks out
>
> The Sprint is {{sprint_fee}}. The exam fee ($125) is separate and paid directly to Anthropic.
>
> One thing to check first: Anthropic's exams are open to people at Claude partner organisations. If your employer isn't one, it can register for free, and you sit the exam under your work address. I'll check this with you before you pay anything.
>
> Details and intake: {{sprint_intake_link}}
>
> Jermaine

## 3A — Associate agreement

**Subject:** Your JMCB Associate agreement

> {{first_name}},
>
> Thanks for the intake. The associate agreement is attached. It covers scope, hours, confidentiality, IP, and how it ends. Sign and send it back, and I'll issue {{requested_address}}@jmcbtech.com the same day.
>
> Jermaine

## 3S — Sprint fee and payment

**Subject:** Your Certification Sprint: fee and next step

> {{first_name}},
>
> Got your intake. You're aiming at {{exam}}{{#if employer}}, registered through {{employer}}{{/if}}.
>
> The Sprint is {{sprint_fee}}: pay here → {{payment_link}}
>
> Once it's paid, I'll send your study plan and we'll book the first session. Reply with two times that work for you this week. I'm available up to 3:00 PM ET, and not on Tuesdays.
>
> Jermaine

## 4A — Your jmcbtech.com address and Partner Academy

**Subject:** Your jmcbtech.com address is live

> {{first_name}},
>
> Your address is **{{jmcb_address}}**. {{#if forwarder}}It forwards to your personal inbox, so there's no new login to manage.{{else}}Sign in at outlook.office.com with the temporary password I'm texting you, and change it on first login.{{/if}}
>
> Now register at Anthropic's Partner Academy **using that address, not your Gmail**. A personal address is rejected when you book the exam, and the credential wouldn't count.
>
> 1. Go to {{partner_academy_link}} and sign up with {{jmcb_address}}.
> 2. Confirm the verification email.
> 3. Reply "registered" and I'll send the study plan.
>
> Use this address for JMCB work only.
>
> Jermaine

## 4S — Sprint: registration route confirmed

> {{first_name}},
>
> You're confirmed to sit the exam through {{employer}}. Register at Partner Academy with your {{employer}} work address, then reply "registered" and I'll send the study plan.
>
> Jermaine

## 5 — Study plan and exam booking

**Subject:** Your two-week plan, and book the exam

> {{first_name}},
>
> Your plan is attached: ten evenings of 75–90 minutes each, mapped to {{their_work}}.
>
> Book the exam now for **{{exam_target_date}}** so the date is real. It's $125 on your own card. It's 53 questions (Developer) or 65 (Architect), scored on a scale, and the credential is valid for 12 months.
>
> Coaching: {{session_1}} and {{session_2}}, on {{meet_link}}.
>
> Jermaine

## 6 — Check-in texts (week 1 and week 2)

> Hi {{first_name}}, Jermaine. How's the plan going? Which night are you on? Any topic that isn't clicking, send it over and we'll use it in Thursday's session.

> {{first_name}}, exam's {{exam_date}}. Do the practice set tonight and send me your weakest domain. We'll close it before the day.

## 7P — Pass

> {{first_name}}, congratulations. That's a proctored credential most people can't even register for. Add it to LinkedIn today and tag JMCB Technology Group. {{#if associate}}Your first real project starts {{start_date}}: {{first_work}}.{{/if}}

## 7R — Not yet

> {{first_name}}, not this time, and that's normal on a first sitting. The retake wait is 14 days. Send me your score report and we'll rebuild the plan around the weak domains. Your coaching access still runs until {{coaching_end}}.
