import Link from "next/link";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "ai-wrote-most-of-my-code-this-year",
  title:
    "I let AI write most of my code this year. Here's what it's actually good at, and what it's not.",
  description:
    "A year of building with AI doing most of the typing. What it speeds up, what it quietly costs you, and the METR study that explains why it can slow down your best people on your hardest codebases.",
  date: "2026-08-17",
  author: "Jermaine F. Barker",
  authorTitle: "Founder & CEO, JMCB Technology Group",
  tags: ["AI Tools", "Software Development", "Productivity"],
  readingTime: 6,
};

export default function AiWroteMostOfMyCodeThisYear() {
  return (
    <>
      <p>
        I let AI write most of my code this year. Not some of it, most of it.
        Autocomplete finishing my sentences, whole functions generated from a
        comment, entire first drafts of features I would otherwise have spent
        an afternoon typing out by hand. If you had told me a few years ago
        that I&apos;d be running a software company this way, I would have
        laughed and gone back to typing. Here&apos;s what an actual year of
        it taught me. No hype, no dunking on the tech, just what I watched
        happen at my own keyboard across a handful of different products.
      </p>

      <h2>What it&apos;s actually good at</h2>
      <p>
        Boilerplate is the easy answer, and it&apos;s true, but it undersells
        the real pattern. AI is genuinely great at anything where the shape
        of the answer is well known and the specific details are what take
        time. Scaffolding a new component. Writing the first pass of tests
        for logic I already understand. Converting a chunk of data from one
        format to another. Catching the dumb mistake before I do, the missing
        null check, the variable name that doesn&apos;t match the one three
        lines up. None of that is glamorous. All of it used to eat hours of a
        week.
      </p>
      <p>
        It gets even more useful the bigger the gap is between what I already
        know and what I&apos;m building. Touching an API I&apos;ve never used,
        wiring up a config for a tool I only reach for twice a year, getting
        oriented in a library&apos;s conventions on day one instead of day
        three. That&apos;s the honest sweet spot: AI fills gaps in my
        knowledge faster than I can fill them myself.
      </p>

      <h2>What it&apos;s actually bad at</h2>
      <p>
        Judgment calls specific to the product and the people using it. Why
        this tradeoff over that one, given what our actual users actually do.
        AI doesn&apos;t know that, and it will confidently guess anyway if you
        let it. It&apos;s also weak on long changes that cross a lot of files
        in a codebase with years of history and its own particular quirks,
        the kind of thing where half the difficulty is remembering why a
        piece of code looks strange, not writing new code that looks normal.
      </p>
      <p>
        The finding that surprised me least, once I&apos;d lived through a
        version of it myself, came from METR, a nonprofit that studies AI
        capabilities. In a study published in July 2025, &quot;Measuring the
        Impact of Early-2025 AI on Experienced Open-Source Developer
        Productivity,&quot; they ran a randomized controlled trial with 16
        experienced developers working in codebases they knew well, 246 tasks
        in total. Going in, the developers expected AI tools to speed them up
        by about 24 percent. What actually happened was the opposite: they
        were about 19 percent slower with AI than without it. And here&apos;s
        the part that should make everyone running an engineering team sit
        up: after finishing the tasks, those same developers still believed
        AI had made them roughly 20 percent faster. The gap between what
        people feel is happening and what a stopwatch says is happening was
        the whole story.
      </p>

      <h2>The codebase you already know is the trap</h2>
      <p>
        I&apos;ve felt my own version of that gap. On a system I&apos;ve
        lived in for a long time, I already have the fix in my head before I
        finish reading the bug report. Writing a prompt, waiting for a
        response, reviewing it carefully enough to trust it, and redirecting
        it when it wanders off in a plausible but wrong direction all cost
        real minutes. When I already had the whole answer, those minutes are
        pure overhead. AI isn&apos;t competing with a blank page in that
        moment. It&apos;s competing with knowledge already sitting in my
        head, and knowledge sitting in your head is fast.
      </p>
      <p>
        That&apos;s the piece most of the excitement skips over. The
        marketing pitch is that AI makes you faster, full stop. The truth,
        for anyone doing serious work, is that it depends heavily on whether
        you&apos;re filling a gap or competing with something you already
        know cold. Pretending otherwise is how teams end up slower and don&apos;t
        notice, exactly like the developers in that study.
      </p>

      <h2>The rule I actually use now</h2>
      <p>
        First draft of something new to me? AI writes it, and I review it
        harder than I&apos;d review a junior engineer&apos;s pull request,
        because it will sound confident whether it&apos;s right or wrong.
        Change to a system I&apos;ve worked in for years, where I can already
        see the fix? I write it myself, and let AI check my typing and catch
        edge cases afterward. That one distinction, gap versus no gap, has
        done more for how I actually use these tools than any strategy memo
        I could write.
      </p>
      <p>
        None of this took a big AI rollout plan to figure out. It took months
        of paying attention to when the tools helped and when they quietly
        got in the way, and being honest with myself about the difference. If
        you&apos;re trying to work out where AI actually fits in how your
        team builds, before you commit real budget or headcount to it,{" "}
        <Link href="/assessment">the free AI readiness assessment</Link>{" "}
        takes about five minutes and gives you a straighter answer than most
        vendor pitches will.
      </p>
    </>
  );
}
