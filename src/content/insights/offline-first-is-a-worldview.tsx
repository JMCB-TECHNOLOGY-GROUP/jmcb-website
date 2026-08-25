import Link from "next/link";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "offline-first-is-a-worldview",
  title: "Offline-first isn't a feature. It's a worldview.",
  description:
    "Building software for places where the internet is a maybe changes how you design everything, not just the sync button. Patterns from real field work, no client names, just what actually holds up.",
  date: "2026-08-24",
  author: "Jermaine F. Barker",
  authorTitle: "Founder & CEO, JMCB Technology Group",
  tags: ["Offline-first", "Systems design", "Delivery"],
  readingTime: 6,
};

export default function OfflineFirstIsAWorldview() {
  return (
    <>
      <p>
        A few years into building software, I got handed a project where the
        connection wasn&apos;t a nice-to-have, it was the whole design
        problem. Field work in parts of Guyana, where cell coverage thins out
        fast once you&apos;re past the coast, power blips without warning, and
        a data plan is a real cost someone is weighing against other real
        costs. I&apos;m not going to name the client or the specifics of that
        engagement here. What I can talk about, honestly and without breaking
        anything, is the pattern it taught me. And once you&apos;ve internalized
        it, you can&apos;t unsee it in every other project you touch.
      </p>
      <p>
        The pattern is this: offline-first isn&apos;t a checkbox you add near
        the end. It&apos;s not &quot;also works when the wifi drops.&quot;
        It&apos;s a different starting assumption that changes decisions you
        make on day one, decisions that are expensive to undo once the app
        already exists.
      </p>

      <h2>Most software is built by people who never lose the connection</h2>
      <p>
        Most software gets designed in an office with fast, stable internet,
        by people who have never once watched a form submission spin for
        thirty seconds and then just die. That&apos;s not a criticism, it&apos;s
        just where the default assumptions come from. The framework docs
        assume a live API. The tutorials assume a database call that resolves
        in milliseconds. The happy path in almost every demo you&apos;ve ever
        seen assumes the network is there, ready, and fast.
      </p>
      <p>
        Go build for a clinic in a place where the connection comes and goes,
        or a field team collecting data somewhere with no tower in sight, and
        that whole stack of assumptions turns into a stack of bugs. Not edge
        cases. The main case. If your software only works when the network
        cooperates, and the network doesn&apos;t cooperate most of the day,
        you haven&apos;t built software. You&apos;ve built a demo that
        occasionally survives contact with reality.
      </p>

      <h2>What actually changes when you flip the assumption</h2>
      <p>
        Flip the starting assumption to &quot;the device is alone right now,
        and that&apos;s normal&quot; and a handful of concrete things change.
      </p>
      <p>
        The data model changes first. Every write has to happen locally,
        immediately, before it ever tries to talk to a server. That means the
        local storage isn&apos;t a cache of the truth, it is a copy of the
        truth, at least until it syncs. Get that backward, treat local storage
        as a temporary cache of server state, and every offline write becomes
        a small crisis instead of a normal Tuesday.
      </p>
      <p>
        Sync becomes a queue, not an event. Every action a person takes
        offline gets recorded as an intent, not just applied and forgotten.
        When the connection comes back, whenever that is, the queue plays
        through in order and reconciles with whatever changed on the server
        side while the device was dark. That reconciliation step is where
        most offline-first projects quietly fall apart, because two people
        editing the same record while both offline is a real situation, not a
        theoretical one, and someone has to decide what happens when their
        queues collide.
      </p>
      <p>
        The interface has to stop lying about certainty. A record that
        hasn&apos;t synced yet needs to look different from one that has,
        because the person using the app deserves to know which promises are
        kept and which are still pending. I&apos;ve seen apps show a green
        checkmark the instant a button is tapped, before anything actually
        reached a server, and that&apos;s a design choice that works great in
        the demo and quietly betrays the user the first time a sync fails
        silently in the background.
      </p>
      <p>
        And testing changes completely. You can&apos;t validate an
        offline-first system by clicking through it on office wifi. You test
        it in airplane mode. You kill the connection mid-write and see what
        the app does. You put two devices offline, make conflicting edits on
        purpose, and bring them both back online to watch the reconciliation
        happen. If your test plan never turns the network off, you haven&apos;t
        actually tested the thing you claimed to build.
      </p>

      <h2>The part that isn&apos;t technical</h2>
      <p>
        Here&apos;s the part I didn&apos;t expect going in. Building this way
        forces a kind of honesty about who the software is actually for.
        Silicon Valley default software design treats a live, fast connection
        as the floor, the minimum acceptable condition. For a huge number of
        the people who would actually benefit from good software, that floor
        is closer to a ceiling they hit on a good day. A nurse doing rounds. A
        field inspector outside the range of a tower. A small business owner
        whose data plan runs out three days before the billing cycle resets.
        Building offline-first is, underneath the architecture, a statement
        about whose Tuesday you&apos;re actually designing for.
      </p>
      <p>
        That reframing traveled with me well past that one project. I bring
        the same posture into work that has nothing to do with unreliable
        internet on paper. Any system that assumes its inputs will always be
        clean, its dependencies will always respond, its third-party API will
        always be up, is making the same mistake in a different costume. Build
        for the worst realistic day first, and treat the best day as a bonus
        instead of the baseline, and the software gets sturdier everywhere,
        not just at the edge of cell coverage.
      </p>

      <h2>Where this shows up now</h2>
      <p>
        I still ask the offline question on every build now, even ones that
        will run on gigabit fiber in a downtown office. What happens the
        instant the network call fails. What does the person see. What
        state does the app hold locally, and does it hold the actual truth
        or just a guess about the truth. Most of the time the honest answer
        exposes a shortcut that would have caused a real problem eventually,
        connectivity or not. The Guyana work didn&apos;t teach me how to
        write a sync algorithm. It taught me to stop assuming the happy path
        is the normal path, which turns out to matter everywhere, not just
        in places where the internet is a maybe.
      </p>
      <p>
        If you&apos;re scoping a build and connectivity, or any other
        assumption you&apos;ve been treating as a given, might not hold up in
        the real conditions your users are actually in,{" "}
        <Link href="/assessment">the free AI readiness assessment</Link> is a
        five-minute way to start figuring out where the gaps actually are,
        before you&apos;ve built around the wrong assumption.
      </p>
    </>
  );
}
