// ============================================================
// ASSESSMENT-CONTENT: Email Nurture Sequence Templates
// Plain text, written in Jermaine's voice
// Variables: {{firstName}}, {{companyName}}, {{overallScore}},
//   {{weakestDimension}}, {{strongestDimension}}, {{companySize}},
//   {{reportBranding}}, {{priorityAction}}, {{calendlyLink}}
// ============================================================

export const NURTURE_EMAILS = {
  day1: {
    subject: "Your AI Readiness Score: {{overallScore}}/100",
    body: `{{firstName}},

Thanks for taking the JMCB AI Readiness Assessment. Your overall score came in at {{overallScore}} out of 100.

Here's what that means in plain English:

Your strongest area is {{strongestDimension}} -- that's a real asset and something to build on. Your biggest opportunity is {{weakestDimension}}, and honestly, that's where I see most {{companySize}} organizations get stuck.

I've attached your full {{reportBranding}} with dimension-by-dimension scores and specific recommendations. It's worth reading through the priority actions section -- those are the moves that will make the biggest difference fastest.

Here's what I typically see companies at your level do next:

1. Focus on one dimension at a time (starting with your weakest)
2. Set a 30-day goal for measurable improvement
3. Get outside perspective on their blind spots

That third one is where I come in if you want it. I do free 30-minute AI strategy calls where we dig into your specific situation and I give you a concrete action plan. No pitch, just practical advice.

Book a time here if that's useful: {{calendlyLink}}

Either way, the report is yours. Hope it helps.

Jermaine Barker
Founder, JMCB Technology Group
jmcbtech.com`,
  },

  day3: {
    subject: "The #1 thing holding back your AI adoption",
    body: `{{firstName}},

I've been thinking about your assessment results, specifically your {{weakestDimension}} score.

Here's something I've learned working with organizations on AI strategy over the past 15 years: the companies that struggle most aren't the ones with bad technology. They're the ones that try to skip the fundamentals.

{{weakestDimension}} is one of those fundamentals. And the good news is it's fixable.

I recently worked with a {{companySize}} organization that had a similar profile to yours. Their {{weakestDimension}} score was actually lower than yours. Within 60 days, they'd moved it up by two full points just by following a structured approach.

The first thing they did: {{priorityAction}}

That single action created a cascade of improvements across their other dimensions too. Turns out when you fix the foundation, a lot of other things start falling into place.

If you haven't looked at the priority actions in your report yet, that's my recommendation for this week. Pick one. Do it. See what shifts.

And if you want to talk through the specifics of your situation, my calendar is open: {{calendlyLink}}

Talk soon,

Jermaine`,
  },

  day7: {
    subject: "Quick question about your AI roadmap",
    body: `{{firstName}},

It's been a week since you took the AI Readiness Assessment. Quick question: have you had a chance to act on any of the recommendations?

No judgment either way. I know how it goes -- you take an assessment, the results make sense, and then the inbox buries it.

Here's why I'm following up: the gap between knowing what to do and actually doing it is where most AI initiatives die. I've seen it happen hundreds of times. The assessment tells you the what. The hard part is the how and the when.

That's literally what I do. I help organizations like yours build a practical AI adoption plan and actually execute it. Not a 50-page strategy doc that sits on a shelf -- a focused 90-day plan with clear milestones.

I have a few openings for free strategy calls this month. 30 minutes, we'll map out your top 3 priorities and I'll give you a specific action plan you can start on immediately.

Book here: {{calendlyLink}}

No pressure. But if your AI readiness score of {{overallScore}} bothered you even a little, it's worth a conversation.

Jermaine

P.S. I should mention -- I'm offering a complimentary AI Quick Start session (normally $1,500) for assessment takers who book before the end of the month. It includes a deep-dive analysis plus a custom action plan. Just mention "assessment" when we connect.`,
  },
};

// ============================================================
// PARTIAL COMPLETION EMAIL (for people who enter email at Q5)
// ============================================================

export const PARTIAL_COMPLETION_EMAIL = {
  subject: "Your AI assessment is waiting (5 questions to go)",
  body: `{{firstName}},

You got halfway through the JMCB AI Readiness Assessment and then life happened. I get it.

The good news: your progress is saved. Click below to pick up right where you left off:

{{resumeLink}}

The second half of the assessment covers the dimensions that most organizations overlook -- governance, culture, and investment alignment. These are usually where the biggest insights come from.

Takes about 3 minutes to finish, and you'll get your full personalized report immediately.

Jermaine Barker
JMCB Technology Group`,
};
