import Link from "next/link";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "what-a-digital-passenger-manifest-would-have-changed",
  title: "What a digital passenger manifest would have changed",
  description:
    "The MV Barima disaster and a 46-person gap between who was on the manifest and who was actually on the boat. That failure mode has a name, a history, and a fix that already exists elsewhere.",
  date: "2026-09-07",
  author: "Jermaine F. Barker",
  authorTitle: "Founder & CEO, JMCB Technology Group",
  tags: ["Maritime safety", "Public policy", "Systems design"],
  readingTime: 6,
};

export default function WhatADigitalPassengerManifestWouldHaveChanged() {
  return (
    <>
      <p>
        On the night of July 18, 2026, a ferry called the MV Barima left
        Georgetown, Guyana, bound for Port Kaituma on the country&apos;s
        northwest coast. Its passenger manifest, the official record of who
        was aboard, listed 133 people. When the vessel capsized roughly seven
        miles offshore, rescuers and investigators eventually worked out that
        179 people had actually been on it, a gap of 46 human beings nobody
        had a name for until after the boat went down. Guyana&apos;s Minister
        of Public Works, Juan Edghill, called it the country&apos;s worst
        maritime disaster in decades. The Commission of Inquiry that
        President Irfaan Ali established on July 26 is still working through
        what happened, and I&apos;m not going to guess at its conclusions
        here. What I want to write about is narrower, and I think more
        useful: the manifest itself, and why a number that should have been a
        fact was instead a formality.
      </p>

      <h2>A count that was wrong before the boat left the dock</h2>
      <p>
        The 46-person gap wasn&apos;t a rounding error discovered days later.
        It was the difference between who bought a ticket, or got logged by
        hand at a gate, and who actually walked onto the vessel. As of July
        28, 77 deaths had been confirmed, with 76 people rescued and 26 still
        reported missing, a set of figures that adds up to the 179 now
        understood to have been aboard. By early September, Demerara Waves
        Online News was reporting 72 bodies recovered against that same
        total, with 76 rescued and search operations still not fully closed
        out. Every one of those numbers moved because the starting number,
        the manifest, was wrong from the moment the ferry left the dock.
        Search and rescue teams didn&apos;t know how many people they were
        looking for. Some families didn&apos;t know to look at all, because
        the person they were missing had never been on a list anyone could
        check against.
      </p>

      <h2>This has happened before, at a scale that&apos;s hard to hold in your head</h2>
      <p>
        It&apos;s tempting to treat this as freak or unprecedented. It
        isn&apos;t. The worst peacetime maritime disaster in recorded history
        is the sinking of the MV Doña Paz off the Philippines in December
        1987, and it happened for almost exactly this reason. The
        ship&apos;s manifest recorded 1,493 passengers and 59 crew. The
        actual number aboard, swollen by Christmas travel season and years of
        off-the-books ticket sales, is now estimated at close to 4,000, an
        estimate the Philippine Supreme Court formally acknowledged in 1999.
        The official death toll, the one that made it the deadliest ferry
        disaster on record, was eventually set at 1,749 per Guinness World
        Records, a figure that still undercounts the people who were never
        on paper to begin with. Thirty-nine years and thousands of miles
        separate Doña Paz from the MV Barima. The failure mode is identical:
        a headcount everyone treated as good enough, until it was the only
        thing standing between a rescue operation and total guesswork.
      </p>

      <h2>The fix isn&apos;t exotic, and parts of it already exist</h2>
      <p>
        What makes this particular failure so frustrating to watch repeat is
        that nobody has to invent the fix. Boarding-time verification, tying
        a timestamped scan of a ticket or ID to the moment a specific person
        crosses onto a vessel, is common practice already in commercial
        aviation and on many large cruise lines. The European Union amended
        its 1998 directive on registering persons aboard passenger ships
        specifically to close this gap, requiring the count to be captured
        digitally and reported within 15 minutes of departure, half the
        30-minute window the original rule allowed, according to the
        European Commission&apos;s own summary of the regulation. That
        isn&apos;t a moonshot. It&apos;s a phone or a barcode scanner at the
        gate and a timestamped log that can&apos;t be edited after the fact,
        paired with a rule that the vessel doesn&apos;t get underway until
        the count of scans matches the count the crew signs off on.
      </p>

      <h2>Why &quot;good enough&quot; keeps winning anyway</h2>
      <p>
        The honest reason most ferry operators, in Guyana or anywhere else
        running older or lower-margin routes, don&apos;t have this today
        isn&apos;t that the technology is hard. It&apos;s that a paper
        manifest and a clipboard have always been good enough, right up
        until the one night they weren&apos;t, and by then the cost of being
        wrong has already been paid in full. That&apos;s the same trap I see
        constantly in software systems that have nothing to do with maritime
        safety: a check that exists on paper, gets treated as a formality
        because it has never once caught anything, and then turns out to be
        load-bearing the one time it mattered. The difference here is that
        the stakes are as high as they get. A Commission of Inquiry can tell
        Guyana what combination of factors sank the MV Barima. It doesn&apos;t
        take a commission to tell you that a boarding count 46 people short
        of reality is not a maritime safety system working as designed.
      </p>

      <p>
        I build software for a living, not ferries, and I&apos;m not going
        to pretend I know what should change in Guyana&apos;s maritime
        regulations beyond what the public record already shows. But the
        underlying pattern, a number that&apos;s allowed to be approximately
        right because it has never been tested, is one I see in a lot of
        places that aren&apos;t ferries: inventory counts, access logs,
        compliance checklists, anywhere &quot;we do a headcount&quot;
        quietly became &quot;we have a piece of paper that says we did.&quot;
        If you want to know where your own operation is treating a count as
        a formality instead of a fact,{" "}
        <Link href="/assessment">the free AI readiness assessment</Link> is a
        five-minute way to find out before something forces the question.
      </p>
    </>
  );
}
