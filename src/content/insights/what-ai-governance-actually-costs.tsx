import Link from "next/link";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "what-ai-governance-actually-costs",
  title: "What “AI governance” actually costs in time, from someone who checked",
  description:
    "NIST AI RMF and ISO 42001 have real, published timelines, and none of them fit in 30 days. Here's what the certification bodies and NIST itself actually say, so you can call out the vendors who are lying to you.",
  date: "2026-08-04",
  author: "Jermaine F. Barker",
  authorTitle: "Founder & CEO, JMCB Technology Group",
  tags: ["AI governance", "Compliance", "Delivery"],
  readingTime: 7,
};

export default function WhatAiGovernanceActuallyCosts() {
  return (
    <>
      <p>
        I keep seeing the same pitch. Some vendor promises &quot;fully
        governed AI in 30 days,&quot; usually right next to a logo wall and a
        stock photo of a handshake. I used to just roll my eyes and move on.
        Then I decided to actually check the published timelines for the two
        frameworks everyone name-drops, NIST&apos;s AI Risk Management
        Framework and ISO/IEC 42001, and write down what I found. Short
        version: nobody who has actually read these documents would say 30
        days with a straight face.
      </p>
      <p>
        This isn&apos;t a knock on governance. It&apos;s the opposite. I think
        the discipline is worth having. But I&apos;d rather tell you the real
        number and let you plan around it than sell you a fantasy and let you
        find out the hard way, three weeks into a project that was never
        going to make its date.
      </p>

      <h2>NIST AI RMF: not a certification, a discipline</h2>
      <p>
        First thing worth knowing: NIST AI RMF isn&apos;t something you get
        certified against, and it isn&apos;t a finish line. NIST itself
        describes it as intended for voluntary use, built around four
        functions that run on a loop rather than a checklist: Govern, Map,
        Measure, and Manage. It was published January 26, 2023, and NIST has
        kept adding to it since, including a Playbook and a Trustworthy and
        Responsible AI Resource Center meant to help organizations work
        through it in practice.
      </p>
      <p>
        That structure matters for the 30-day claim, because there&apos;s no
        version of &quot;stand up Govern, Map, Measure, and Manage&quot; that
        is a one-time task you complete and file away. It&apos;s an ongoing
        management loop, the same way your accounting isn&apos;t something
        you finish in January and never touch again. Anyone telling you
        they&apos;ll have you &quot;NIST AI RMF compliant&quot; in a month is
        selling you a category error, because compliant in the certification
        sense isn&apos;t what this framework offers. What it offers is a
        structure for a process you keep running.
      </p>

      <h2>ISO 42001: the one with an actual clock on it</h2>
      <p>
        ISO/IEC 42001 is different. It&apos;s an actual certifiable
        management system standard, with real auditors and a real
        certificate at the end, which means it also has real, published
        timelines you can check instead of guess at.
      </p>
      <p>
        ISMS.online, one of the compliance platforms that runs organizations
        through this process, publishes the range plainly: an organization
        starting from zero should expect five to nine months from kickoff to
        a passed Stage 2 audit. If you already hold ISO 27001 certification
        and can reuse that management system&apos;s risk processes and
        controls, that compresses to three to five months. Their fastest
        quoted case, a mature ISO 27001 shop with a tight scope, dedicated
        program management, and platform support doing a lot of the
        heavy lifting, is eight to twelve weeks. That&apos;s the best case
        they publish, not the typical one, and it&apos;s still two to three
        times longer than 30 days.
      </p>
      <p>
        Schellman, an accredited ISO certification body that actually
        performs these audits, breaks down what happens inside that window.
        The Stage 1 audit, which checks whether your documentation and
        readiness are even in shape for a real audit, typically runs one to
        two days. Then there&apos;s a gap before Stage 2, typically four to
        twelve weeks, and by Schellman&apos;s own guidance it shouldn&apos;t
        stretch past six months or the certification body will want to
        re-check your readiness. Stage 2, the audit that actually decides
        certification, runs three to nine-plus days depending on
        organization size. After you&apos;re certified, it&apos;s not over:
        annual surveillance audits run for the three-year life of the
        certificate, each one roughly a third the length of the original
        review.
      </p>
      <p>
        Add that up and the honest floor, for a small, well-prepared
        organization with an existing ISO 27001 program, is around three
        months. For everyone else, closer to six to nine. None of that
        includes the work before Stage 1 even happens: the gap assessment,
        writing the policies, building the risk register, training staff on
        a system that didn&apos;t exist yet. That work isn&apos;t optional
        and it isn&apos;t fast, because the auditors are specifically
        checking whether it was done properly, not whether it exists on
        paper.
      </p>

      <h2>Why the 30-day pitch survives anyway</h2>
      <p>
        I think the confusion is mostly a language problem, and vendors have
        learned to exploit it. &quot;Governed&quot; can mean two very
        different things. It can mean the internal discipline I described in
        an earlier post here: access controls, audit logging, a human
        checkpoint where the stakes justify it, a named owner for what the
        system does. That kind of internal governance, scoped to one
        workflow, can genuinely take shape inside a 90-day build, and I
        stand by that timeline for what it actually covers.
      </p>
      <p>
        Or &quot;governed&quot; can mean formally certified against a named
        external standard, with an accredited third party signing off on it.
        That&apos;s the ISO 42001 path, and the published numbers above are
        what that actually costs in time. Selling the second thing with the
        first thing&apos;s timeline is where the lie lives. Nobody who reads
        Schellman&apos;s own audit breakdown would promise a Stage 2 pass in
        30 days, because the vendor doesn&apos;t control the auditor&apos;s
        calendar, and the standard requires evidence of a working system,
        not a freshly written policy binder.
      </p>
      <p>
        If someone quotes you a 30-day timeline for certified governance, ask
        them one question: which stage, exactly, happens in week one, which
        in week two, and who is the accredited body doing your Stage 2 audit
        on that schedule. Watch how fast the specificity disappears.
      </p>

      <h2>What to actually plan for</h2>
      <p>
        If you want internal governance controls around a single AI
        workflow, that 90-day build I described in my pilots post is still
        the right target. If you want an actual ISO 42001 certificate, plan
        for a minimum of three months if you already have ISO 27001 and a
        realistic six to nine if you don&apos;t, and build your roadmap
        around the certification body&apos;s calendar, not your marketing
        calendar. If you&apos;re working from the NIST AI RMF, stop looking
        for a finish date, because there isn&apos;t one. It&apos;s a loop you
        run, and the honest measure of progress is whether Govern, Map,
        Measure, and Manage are actually happening this quarter, not whether
        you can check a box that says done.
      </p>
      <p>
        None of this is a reason to skip governance. It&apos;s a reason to
        scope it honestly, on its own timeline, the same way I&apos;d tell
        you to scope a procurement cycle separately from a build. If you want
        help figuring out which kind of &quot;governed&quot; your
        organization actually needs, and on what real calendar,{" "}
        <Link href="/assessment">the free AI readiness assessment</Link> is a
        five-minute way to start that conversation honestly.
      </p>
    </>
  );
}
