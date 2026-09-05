import Link from "next/link";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "why-your-ehr-export-is-a-mess",
  title:
    "Why your EHR export is a mess, and why software goes quiet about what it can't read",
  description:
    "The same failure mode I had to design around building a CV parser shows up, at much higher stakes, in how electronic health records move between systems. What silent data loss actually looks like, and the nothing-dropped rule that fixes it.",
  date: "2026-08-31",
  author: "Jermaine F. Barker",
  authorTitle: "Founder & CEO, JMCB Technology Group",
  tags: ["Healthcare IT", "Data quality", "Systems design"],
  readingTime: 6,
};

export default function WhyYourEhrExportIsAMess() {
  return (
    <>
      <p>
        A few months back I was building a resume parser for a career
        assessment tool, the part that reads whatever CV a job seeker uploads,
        PDF, Word, OpenDocument, plain text, and turns it into structured
        data an AI can work with. Somewhere in week one I ran into a problem
        that had nothing to do with AI at all: some of those files don&apos;t
        parse cleanly. A PDF exported from an odd tool. A Word document with a
        table nested inside another table. The parser does its best, pulls out
        what it can read, and quietly moves on. What it can&apos;t read just
        isn&apos;t there anymore, and nothing on screen tells you that.
      </p>
      <p>
        That&apos;s a small, low-stakes version of a problem that shows up
        constantly in a much higher-stakes place: electronic health records.
        Once you&apos;ve built the small version and had to actually solve
        it, you start noticing the big version everywhere, and in healthcare
        it isn&apos;t a resume that loses a bullet point. It&apos;s a
        patient&apos;s medical history that loses a diagnosis, a medication,
        or a lab result on the way from one system to another.
      </p>

      <h2>The failure mode is always the same shape</h2>
      <p>
        Here&apos;s the pattern, and it repeats everywhere I&apos;ve seen it.
        A piece of software receives a document in some format it mostly
        understands. It reads the parts that map cleanly onto its own data
        model. The parts that don&apos;t map cleanly, an unusual field, a
        formatting quirk, a section the receiving system just never bothered
        to support, get dropped. Not flagged as dropped. Not logged as a
        partial success. Just gone, while the process that dropped them
        reports back that the import completed fine.
      </p>
      <p>
        For a resume, that&apos;s an annoyance. For an electronic health
        record moving from a hospital&apos;s system to a specialist&apos;s
        system, or into a patient&apos;s own portal, that&apos;s a doctor
        making a decision without a piece of information they had every
        reason to believe was there. Nobody built it that way on purpose.
        It&apos;s what happens when a very old, very common architecture
        pattern, best-effort parsing with silent failure, gets applied to
        records where silence is the expensive part.
      </p>

      <h2>The data backs up how common this actually is</h2>
      <p>
        I want to be careful here, because this is exactly the kind of claim
        that&apos;s easy to overstate with a vibe instead of a number. So
        here&apos;s the real one. A study published in JAMA Network Open in
        November 2025, &quot;EHR Interoperability Experiences Reported by
        Family Physicians,&quot; surveyed 8,122 family physicians using data
        from the 2024 American Board of Family Medicine certification
        questionnaire. Fewer than 15 percent reported what the study defined
        as an ideal interoperability experience, meaning they could often
        obtain, find, and reconcile external data inside their own EHR. Broken
        down by data type, it ranged from 19 percent for encounter documents
        down to just 8 percent for test results coming from an outside
        hospital.
      </p>
      <p>
        Read that again slowly. These aren&apos;t patients struggling with a
        confusing portal. These are the physicians themselves, inside the
        systems built specifically for this job, saying that most of the time
        the external data either doesn&apos;t show up, is hard to find, or
        doesn&apos;t reconcile cleanly with what&apos;s already there. That
        gap between &quot;the export technically succeeded&quot; and &quot;the
        information actually made it across intact&quot; is the whole
        problem, and it&apos;s
        the norm, not the exception.
      </p>
      <p>
        At the same time, more patients than ever are actually looking. Per
        the ONC data brief on patient portal and health app use, published by
        the Assistant Secretary for Technology Policy in July 2025, 77
        percent of individuals were offered online access to their health
        information in 2024, up from 73 percent in 2022. More people are
        opening their own records every year. If those records quietly
        dropped something on the way in, more people are now in a position to
        notice, and fewer are positioned to know what they&apos;re not seeing.
      </p>

      <h2>Why the export still says success</h2>
      <p>
        This is the part that took me a while to internalize, and it&apos;s
        the same lesson from the resume parser, just with worse consequences.
        A document export can be schema-valid and still be semantically
        empty in the places that matter. A C-CDA document, the standard
        clinical document format most certified EHRs produce, can pass every
        structural check a receiving system runs on it, the tags are all in
        the right place, the required sections exist, and still carry a
        narrative note that never gets parsed into anything a human on the
        other end can act on. The file is valid. The information inside it
        might as well not exist for the physician trying to use it.
      </p>
      <p>
        Nobody involved is doing anything wrong on purpose. The exporting
        system met its certification requirements. The receiving system
        handled the fields it knows how to handle. The gap lives in the space
        between what the format technically allows and what any given piece
        of software actually chose to build support for. That gap doesn&apos;t
        show up as an error, because nothing in the pipeline was designed to
        notice it. It just shows up later, as a doctor asking a patient a
        question the patient already answered somewhere else.
      </p>

      <h2>The nothing-dropped rule</h2>
      <p>
        Building that resume parser, I landed on a rule that I now think
        should apply a lot more broadly than resumes: never let the system
        quietly discard something it couldn&apos;t handle. Every claim the
        AI made about a candidate&apos;s resume gets checked against the
        actual extracted text before it&apos;s allowed to appear anywhere.
        If it can&apos;t be traced back to the source document, it gets
        dropped from the output, not silently kept as if it were verified.
        The point isn&apos;t that the parser is perfect. It isn&apos;t. The
        point is that the system doesn&apos;t get to pretend it is.
      </p>
      <p>
        Healthcare software could adopt the same discipline without waiting
        for a new interoperability standard to save everyone. Flag what
        didn&apos;t parse instead of dropping it. Show a &quot;this section
        couldn&apos;t be reconciled&quot; marker instead of a blank space that
        looks identical to &quot;there was nothing here.&quot; Give the
        physician, or the patient reading their own chart, a way to know the
        difference between &quot;confirmed absent&quot; and &quot;we
        couldn&apos;t read it.&quot; That one
        distinction is not a hard engineering problem. It&apos;s a design
        decision that most systems simply never made, because success metrics
        for these exports have historically measured whether the file
        validated, not whether the meaning inside it survived the trip.
      </p>

      <h2>What this means if you&apos;re building or buying health software</h2>
      <p>
        If you&apos;re evaluating a system that claims interoperability,
        ask the boring question nobody asks in the sales demo: what happens
        to the data it can&apos;t parse? Not what happens to the data it can,
        every vendor has a good answer for that part. Ask about the failure
        path. A vendor with a real answer will tell you exactly what gets
        flagged, logged, and surfaced. A vendor without one will change the
        subject back to how many data types they support, which is a
        different question with a much less honest answer underneath it.
      </p>
      <p>
        The nothing-dropped standard is a low bar in one sense. It doesn&apos;t
        require solving interoperability. It just requires telling the truth
        about where it currently fails, instead of letting a green checkmark
        stand in for a completeness nobody actually verified. That&apos;s a
        smaller ask than it sounds, and almost nobody is doing it. If
        you&apos;re trying to figure out where your own systems are quietly
        dropping things they never flagged,{" "}
        <Link href="/assessment">the free AI readiness assessment</Link> is a
        five-minute way to start finding out before a patient, or a customer,
        finds out for you.
      </p>
    </>
  );
}
