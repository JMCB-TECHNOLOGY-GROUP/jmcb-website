import Link from "next/link";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "state-esa-money-reshaping-who-pays-for-tutoring",
  title:
    "State ESA money is reshaping who pays for tutoring, and what it means for homeschool families",
  description:
    "State education savings account programs now move real money into tutoring, curriculum, and homeschool spending. What the 2026 numbers actually show, and what it means if you're building or buying education products.",
  date: "2026-09-21",
  author: "Jermaine F. Barker",
  authorTitle: "Founder & CEO, JMCB Technology Group",
  tags: ["Education", "EdTech", "ESA"],
  readingTime: 6,
};

export default function StateEsaMoneyReshapingWhoPaysForTutoring() {
  return (
    <>
      <p>
        One of the next moves on our list for LeapIQ, the kids&apos; learning
        app we build here, is applying to become an approved vendor under
        state education savings account programs. We haven&apos;t filed it
        yet. But looking into what that application actually asks for sent me
        down a research hole on how these programs work in 2026, and the
        numbers turned out to be bigger and stranger than I expected.
      </p>

      <h2>What an ESA actually is, quickly</h2>
      <p>
        An education savings account gives a family public education money
        directly, usually loaded onto a card or an online account, instead of
        routing it through a school district. The family decides how to spend
        it inside an approved list of categories: private school tuition,
        curriculum, therapies, and, in most programs, tutoring. According to
        EdChoice, the nonprofit that tracks school choice policy nationally,
        there were 21 ESA programs operating in 18 states as of its May 2025
        count, with an estimated 488,736 students receiving funds through
        them. That&apos;s not a pilot anymore. That&apos;s a number with six
        figures on both ends.
      </p>

      <h2>The money side is growing fast, state by state</h2>
      <p>
        Every state runs its own program, with its own rules and its own
        appetite for spending, and 2026 has been a year of that appetite
        going up almost everywhere. Alabama&apos;s CHOOSE program is funded
        at $250 million to cover roughly 50,000 students this year, per
        EdChoice&apos;s tracking. Missouri raised its MOScholars
        appropriation to $60 million, a $10 million increase from the year
        before. Oklahoma&apos;s Parental Choice Tax Credit went from $250
        million to $275 million. Tennessee raised its enrollment cap from
        25,000 students to 35,000. South Dakota widened eligibility from 150
        percent of the federal poverty line to 200 percent and now covers up
        to roughly $5,000 per student, the full per-pupil share in that
        state.
      </p>
      <p>
        Texas is the number that actually stopped me. EdChoice reports about
        95,600 funded accounts against 274,000 applications, which leaves
        roughly 178,400 families on a waitlist. That&apos;s not a program
        struggling to find takers. That&apos;s a program where demand
        outran the money on day one, in a state that just started.
      </p>

      <h2>Tutoring is explicitly on the approved list</h2>
      <p>
        Here&apos;s the part that matters if you build education products.
        EdChoice&apos;s own description of ESA-eligible spending names
        tutoring and online education programs alongside curriculum and
        private tuition. Families aren&apos;t only using this money to leave
        a school district. Plenty are using it to layer extra help on top of
        whatever school their kid already attends, or to build a homeschool
        plan that includes a paid tutor for the subject a parent doesn&apos;t
        want to teach themselves.
      </p>
      <p>
        That intersects with a homeschooling population that&apos;s already
        large and still climbing. The National Home Education Research
        Institute put the 2024 to 2025 school year estimate at 3.408 million
        K-12 homeschool students nationally, a range of roughly 3.07 to 3.75
        million, or about 6.26 percent of the school-age population. I
        don&apos;t have a clean, verified number for exactly how much of
        that population is drawing on ESA funds for tutoring specifically,
        and I&apos;d rather leave that blank than hand you a figure I made
        up to sound complete. What I can tell you honestly is that the two
        trends, more ESA money and a bigger homeschool population, are
        moving in the same direction at the same time, and tutoring sits
        right at the overlap.
      </p>

      <h2>What this actually means if you&apos;re building the product</h2>
      <p>
        A few things stand out already, before we&apos;ve even filed
        LeapIQ&apos;s application.
      </p>
      <p>
        First, being a good tutoring product doesn&apos;t get you paid.
        Being an approved vendor does. Every state keeps its own list, its
        own application, and its own idea of what documentation counts as
        proof you&apos;ll deliver what you say you will. Getting listed in
        Arizona doesn&apos;t get you listed in Florida. Budget for that as
        real operational work, not a footnote.
      </p>
      <p>
        Second, expect an audit trail requirement, and expect it to be
        reasonable. Public money spent on a private service almost always
        means being able to show, after the fact, that the service actually
        happened, not just that it was billed. If your product can&apos;t
        produce that kind of record cleanly, that&apos;s worth fixing before
        you apply, not after a state asks for it.
      </p>
      <p>
        Third, the Texas waitlist number is a warning as much as it&apos;s
        an opportunity. A state can announce a program, get flooded with
        applications, and still leave most families waiting for money that
        hasn&apos;t been appropriated yet. If your business plan assumes
        every eligible family gets funded on day one, Texas is your reminder
        that eligibility and funding are two different lines on the budget,
        and the gap between them can be six figures wide.
      </p>
      <p>
        Fourth, and this is the one I keep coming back to: the family is the
        customer now, not the district. That changes what &quot;good&quot;
        means for a product. A district buyer cares about compliance,
        integration, and a sales cycle measured in months. A parent spending
        their own ESA balance on a tutor for their kid cares about whether
        it worked this week. Build for the second buyer and the first one
        gets easier to sell to later. Build for the first one only, and
        you&apos;ll be surprised how little of the ESA money actually
        reaches you.
      </p>

      <h2>Where I&apos;d start if I were you</h2>
      <p>
        If you&apos;re building or selling into this space, start with one
        state, not eighteen. Read that state&apos;s actual approved-vendor
        requirements before you build anything, because the documentation
        burden shapes the product more than people expect. Talk to a handful
        of homeschool families who are already spending ESA money on
        tutoring or outside instruction, and ask them what almost stopped
        them from doing it. The friction is rarely the idea. It&apos;s the
        form.
      </p>
      <p>
        We haven&apos;t filed LeapIQ&apos;s ESA vendor application yet. When
        we do, I&apos;m expecting it to take longer than the checklist
        suggests, because it usually does. If you want a clearer read on
        where your own product actually stands before you sink weeks into a
        state application,{" "}
        <Link href="/assessment">the free AI readiness assessment</Link> is
        a five-minute way to find the gaps before a state application finds
        them for you.
      </p>
    </>
  );
}
