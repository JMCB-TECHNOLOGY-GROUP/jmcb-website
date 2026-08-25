import Link from "next/link";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "30-90-rule-what-fits-what-doesnt",
  title: "The 30/90 rule: what actually fits in 30 days, and what honestly doesn't",
  description:
    "Working AI in 30 days and governed production in 90 is a real promise, not a marketing number. Here's exactly what lives inside each window, and what I cut when a client tries to rush it.",
  date: "2026-08-10",
  author: "Jermaine F. Barker",
  authorTitle: "Founder & CEO, JMCB Technology Group",
  tags: ["AI strategy", "Delivery", "Scope"],
  readingTime: 6,
};

export default function ThirtyNinetyRule() {
  return (
    <>
      <p>
        Every AI vendor pitch has a number in it somewhere. Ninety days to
        transformation. Thirty days to full deployment. Sixty days to ROI.
        I used to roll my eyes at these and move on, until I noticed the
        numbers were doing real damage: clients would sign up expecting the
        big number and get nothing usable by the time it arrived, because
        the number was picked to sound good in a sales call, not because
        anyone worked backward from what the work actually requires.
      </p>
      <p>
        So a while back I switched to two numbers instead of one, and I
        published exactly what each of them covers, because a promise you
        won't write down in public probably isn't one you believe. Working
        AI in 30 days. Governed production in 90. Here's what actually lives
        inside each window, and just as important, what I tell people has to
        wait.
      </p>

      <h2>What 30 days is actually for</h2>
      <p>
        Thirty days buys you one scoped use case, built on the client's own
        data, live in real users' hands. Not a demo environment. Not a
        sandbox with sample data that looks impressive and means nothing.
        One workflow, one owner, running against the data that workflow
        actually touches every day.
      </p>
      <p>
        That's a tighter box than it sounds. It means picking the single
        highest-friction, highest-repetition task in someone's week, not the
        most impressive-sounding one. It means the data pipeline for that
        one workflow has to exist and be clean enough to trust, which is
        usually the part that eats the most of the thirty days, not the
        model work. And it means a real person has to use the output and
        tell you honestly whether it helped, because a system nobody
        actually uses isn't done, it's just unreleased.
      </p>
      <p>
        What fits in thirty days is narrow on purpose. I've watched teams
        try to stretch that window to cover three workflows instead of one,
        and I understand the instinct, more surface area feels like more
        value. It's the opposite. Splitting the days across three workflows
        means none of them gets the data cleanup or the real usage testing
        that made the single-workflow version trustworthy. You end up with
        three unfinished things instead of one finished thing, and
        unfinished things don't get used.
      </p>

      <h2>What 90 days adds, and why it can't happen sooner</h2>
      <p>
        The next sixty days aren't for more features. They're for making the
        thing safe to depend on: access controls, logging so you can see
        what the system actually did, a human checkpoint wherever the
        stakes justify one, monitoring so you find out about drift before
        your customers do, and a named owner who's accountable for what the
        system produces. None of that is optional, and none of it is fast,
        because you're building it against a system that's now handling
        real work, which means every change gets tested against real
        consequences instead of a sandbox.
      </p>
      <p>
        This is also where I draw a hard line I wrote about in more detail
        in an earlier post here: internal governance, the kind I just
        described, is a 90-day build. Formal external certification against
        a named standard, like ISO 42001, is a different thing entirely with
        its own published timeline measured in months, not weeks, and it
        runs on its own separate calendar. Anyone folding a certification
        audit into a 90-day delivery promise is either confused about the
        difference or hoping you won't ask.
      </p>
      <p>
        Gartner's research puts the average trip from a working prototype to
        real production at eight months, and finds that only around 48
        percent of prototypes make that trip at all. Ninety days beats that
        average by a wide margin, and it beats it specifically because the
        scope stayed narrow the entire time. The eight-month average
        includes all the projects that tried to cover more ground and got
        stuck redoing the parts they rushed.
      </p>

      <h2>The failure mode is trying to do both windows at once</h2>
      <p>
        Almost every blown timeline I've seen traces back to the same
        mistake: someone tried to build the governed, monitored, fully
        access-controlled version on day one, before anyone had confirmed
        the workflow was even worth automating. That's backward. You don't
        know which access controls matter until real people have used the
        thing and told you where it breaks. Building the guardrails before
        you've found the actual risks means guessing at the guardrails,
        and guessed guardrails are usually either too loose to matter or so
        strict nobody can get their work done.
      </p>
      <p>
        The other direction fails just as often. Teams ship the 30-day
        version and then treat it as finished, skip the next sixty days
        entirely, and let a system with no logging, no fallback, and no
        named owner keep running against real work. That's not a shortcut,
        it's a demo wearing a production system's clothes. It works fine
        until the day it doesn't, and by then nobody remembers who's
        supposed to notice.
      </p>
      <p>
        The rule holds because the two windows do different jobs in a fixed
        order. Thirty days answers whether the workflow is worth automating
        at all, using real data and real usage as the test. Ninety days
        answers whether it's safe to keep running that way. Skip straight to
        the second question and you're guessing. Answer the first question
        and stop there, and you've shipped a liability with a good demo.
      </p>

      <h2>What I tell people who want it faster</h2>
      <p>
        Every few weeks someone asks if I can compress the ninety days,
        usually because a board meeting or a renewal date is forcing the
        question. My honest answer is that the thirty-day number compresses
        a little if the data is already clean and the workflow is already
        well understood, because those are the two things that actually eat
        time in that window. The ninety-day number compresses much less,
        because access controls, monitoring, and a genuine human checkpoint
        aren't things you can rush without them becoming decorative.
      </p>
      <p>
        What I won't do is quote a smaller number to win the meeting and
        then discover the real one during the build. That's how a client
        ends up with the eight-month Gartner outcome wearing a ninety-day
        label. The honest version of speed is scoping tighter, not
        promising faster.
      </p>

      <p>
        If you're trying to figure out what would actually fit in your first
        thirty days, given your own data and your own team,{" "}
        <Link href="/assessment">the free AI readiness assessment</Link>{" "}
        takes about five minutes and gives you a straight answer instead of
        a sales number.
      </p>
    </>
  );
}
