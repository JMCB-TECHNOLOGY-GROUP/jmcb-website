import Link from "next/link";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "solo-founder-fifteen-products",
  title: "Solo Founder, Fifteen Products: What I'd Actually Do Differently",
  description:
    "I've started fifteen products. A handful are alive right now, spanning healthcare, maritime government work, education, and content tools. The honest version of what that teaches you about focus, not the LinkedIn version.",
  date: "2026-09-28",
  author: "Jermaine F. Barker",
  authorTitle: "Founder & CEO, JMCB Technology Group",
  tags: ["Founder Lessons", "Focus", "Building in Public"],
  readingTime: 6,
};

export default function SoloFounderFifteenProducts() {
  return (
    <>
      <p>
        Fifteen products. That's the honest number if I sit down and count
        everything I've actually started, not just the ones with a live URL
        today. Most of those fifteen aren't running anymore. A few are. I'm
        not going to pretend I can give you a tidy story for each one,
        because I can't, and a founder who claims he remembers exactly why
        every one of fifteen things lived or died is telling you a cleaner
        story than the truth. What I can tell you honestly is what carrying
        that many things at once actually does to a person, and what I'd do
        differently if I were starting today instead of years ago.
      </p>

      <h2>What's actually running right now</h2>
      <p>
        Right now, at the same time, I have a content management platform
        for small businesses, a health records platform for patients and
        small clinics, a maritime operations platform built for small
        island governments, and an adaptive learning platform for kids that
        started life under a different name before it became LeapIQ. Four
        products, four completely different buyers, four completely
        different regulatory environments. A hospital compliance officer, a
        parent picking software for their kid, a government maritime
        administrator, and a small business owner who just wants content to
        stop being a weekly fire drill do not read the same sales page or
        trust the same signals. Building for all four at once is not a
        growth hack. It's just what happened, one real problem at a time,
        because I kept noticing problems I thought I could actually fix.
      </p>

      <h2>The part nobody puts on the slide</h2>
      <p>
        Here's the part that doesn't fit neatly into a founder story. Most
        of the fifteen didn't fail because the idea was bad. They faded
        because I ran out of the one resource that doesn't scale no matter
        how good you get at everything else: my own attention split across
        too many things that all deserved more of it than they got. A
        product doesn't need a founder to be a genius. It needs a founder to
        show up consistently long enough for the unglamorous parts, the
        support ticket, the compliance detail, the slow trust building with
        a first real customer, to compound. Spread across fifteen things,
        consistency is the first casualty, and it's the one that kills
        quietly instead of dramatically.
      </p>
      <p>
        I want to be careful here, because it would be easy to turn this
        into a false lesson: start one thing, never start anything else,
        the end. That's not actually what I believe, and it's not what I did
        even after learning this the hard way. What changed wasn't the
        number of things I was willing to start. It was how fast I was
        willing to admit one of them wasn't working, and how honestly I
        tracked that instead of quietly hoping it would turn a corner.
      </p>

      <h2>The rule that actually saved the ones that survived</h2>
      <p>
        The principle I hold every product to now, written down so I can't
        talk myself out of it in the moment, is simple: if the technology
        doesn't create measurable results within 90 days, it's not ready
        for production. Not ninety days to feel promising. Ninety days to
        show something real, measured, and honest. That rule is the reason
        the four products still running are still running, and it's the
        same rule, just applied to sales instead of engineering, behind a
        habit I've built into how I track pipeline now: a deal that hasn't
        moved in fourteen days gets a next action or gets marked dead, no
        quiet zombie deals sitting in a spreadsheet pretending to be
        progress. Both rules exist for the identical reason. Hope is not a
        status update, and the fastest way to waste years is to let
        something limp along because ending it feels worse than the slow
        bleed of not deciding.
      </p>

      <h2>What I'd actually do differently</h2>
      <p>
        Not "focus on one thing." I've tried saying that to myself and I
        don't believe I'd have listened, because the itch to build when I
        see a real problem isn't something I expect to switch off, and I'm
        not sure I'd want it to. What I'd do differently is set the 90-day
        and 14-day rules on day one instead of learning them around product
        eight or nine. I'd write down, before I started, exactly what
        result would tell me this one is real, and exactly what result
        would tell me to stop. Most of the cost of those earlier products
        wasn't the building. It was the months I spent not admitting one of
        them had already told me its answer.
      </p>
      <p>
        If there's a version of this essay that people actually share, I
        hope it's not the part where I sound like I have it figured out.
        It's this part: the discipline that matters most in a founder isn't
        the ambition to start things. Almost anyone with a little courage
        and a little savings can start something. It's building a habit of
        honest measurement strict enough to tell you the truth about
        something you desperately want to be working, before your own hope
        tells you a different story.
      </p>
      <p>
        None of this is a complaint. I chose every one of those fifteen
        starts, and I'd still rather be the person who tried the thing and
        had to admit it wasn't working than the person who never tried
        because admitting failure sounded too uncomfortable. The discipline
        isn't a cure for ambition. It's what keeps ambition from quietly
        turning into denial.
      </p>
      <p>
        If you're trying to figure out honestly whether something you're
        building or buying is actually working, or just feels like it is,{" "}
        <Link href="/assessment">the free AI readiness assessment</Link>{" "}
        applies the same kind of blunt, five-minute measurement to your own
        operation that I wish I'd applied to my own earlier products.
      </p>
    </>
  );
}
