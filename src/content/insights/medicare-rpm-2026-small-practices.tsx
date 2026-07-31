import { CALENDLY_URL } from "@/lib/constants";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "medicare-rpm-2026-small-practices",
  title: "Medicare quietly changed the math on remote patient monitoring this year",
  description:
    "New 2026 CPT codes removed the thresholds that made RPM impractical for small practices. What changed, what it pays, and how to run a program without burning out your staff.",
  date: "2026-07-28",
  author: "Jermaine F. Barker",
  authorTitle: "Founder & CEO, JMCB Technology Group",
  tags: ["Healthcare", "RPM", "Medicare"],
  readingTime: 6,
};

export default function MedicareRpm2026() {
  return (
    <>
      <p>
        First, the plain-English version, because the acronyms scare off the
        people who&apos;d benefit most. Remote patient monitoring, RPM, means
        a patient takes readings at home, usually blood pressure, weight, or
        glucose, on a device that sends the numbers back to your practice
        automatically. Chronic care management, CCM, is the monthly
        between-visit work your staff already half-does for chronic patients
        anyway: reviewing numbers, adjusting care plans, making the phone
        call when something looks off. Medicare pays for both, per patient,
        per month. That&apos;s the whole concept.
      </p>
      <p>
        Plenty of small practices looked at RPM years ago, did the math, and
        passed. Honestly, they were often right to pass. The old rules had
        two trapdoors. You needed 16 days of device readings in a month
        before you could bill for the device supply, and 20 minutes of
        logged clinical time before you could bill for management. A patient
        who took readings 14 days that month, or a nurse who spent 17
        minutes instead of 20? You did the work and billed nothing. Running
        a program where a patient&apos;s forgetfulness erases your revenue
        is a bad business, and small practices correctly smelled it.
      </p>

      <h2>What changed in January</h2>
      <p>
        Effective January 2026, Medicare added new codes that remove both
        trapdoors. New CPT code 99445 removes the old 16-day device-data
        floor, so a month with fewer reading days is no longer a month of
        free work. And new code 99470 removes the 20-minute floor on
        management time. The all-or-nothing structure that made these
        programs fragile for small teams is gone.
      </p>
      <p>
        The rates are real money at primary care scale. For 2026, the
        national non-facility rates are $52.11 per month for device supply
        under 99454, $51.77 for the first 20 minutes of management time
        under 99457, and $66.13 for CCM under 99490. Combined RPM and CCM
        programs commonly reach $150 to $211 per patient per month. Local
        rates vary by geography, so check your own contractor&apos;s
        schedule before you build a budget on those numbers. But the shape
        of the opportunity is clear: recurring monthly revenue, tied to work
        that genuinely helps the patients who cost the system the most.
      </p>
      <p>
        And that last part matters more than the billing. A hypertensive
        patient whose numbers you see weekly is a patient whose medication
        gets adjusted in days, not at the next annual visit. The revenue is
        the reason the program survives budget season. The clinical upside
        is the reason to want it to.
      </p>

      <h2>So why does the money stay on the table?</h2>
      <p>
        Because the billing codes are simple and the operations aren&apos;t.
        Somebody has to enroll patients and get consent. Somebody has to
        ship devices, confirm they work, and chase the ones that go quiet.
        Somebody has to actually look at the readings, log their minutes,
        and produce documentation that would survive an audit. In a practice
        where the front office is three people deep, that&apos;s not a side
        project. It&apos;s a new job nobody was hired for.
      </p>
      <p>
        This is the honest reason small practices skip RPM, and it&apos;s
        rational. The old threshold rules punished imperfect execution, and
        imperfect execution is the natural state of a busy clinic. What the
        2026 changes did was remove the punishment. What they didn&apos;t do
        is remove the work. If you enroll fifty patients with no workflow
        behind them, you&apos;ll have fifty cuffs in junk drawers by
        Thanksgiving and a compliance headache to go with them.
      </p>

      <h2>What a sensible program looks like</h2>
      <p>
        I&apos;ve spent the past year building software for exactly this
        problem, and the programs that work share a few unglamorous
        decisions.
      </p>
      <p>
        Start with hypertension patients only. It&apos;s usually your
        largest eligible population, blood pressure cuffs are the cheapest
        and most familiar device, and the clinical protocol is clear enough
        that your staff won&apos;t be improvising. Resist the urge to launch
        with five conditions. You can add diabetes later. You can&apos;t
        easily rebuild trust with staff who watched the first version
        collapse.
      </p>
      <p>
        Use cellular cuffs, not Bluetooth. No app, no pairing, no smartphone
        required, nothing for a 78-year-old to configure. The patient
        squeezes the cuff, the reading shows up. Every setup step you remove
        makes it more likely that patient is still transmitting in month
        six, and month six is where these programs are won or lost.
      </p>
      <p>
        Budget about 20 staff minutes per patient per month, and protect
        that time in a real person&apos;s real schedule. A named medical
        assistant with a standing block beats &quot;the team will handle
        it&quot; every single time. If the minutes aren&apos;t on a
        calendar, they don&apos;t exist.
      </p>
      <p>
        And make the documentation automatic. Time logs, reading counts, and
        care plan notes should be captured as the work happens, not
        reconstructed from memory at month end. Reconstructed documentation
        is where billing compliance goes to die, and it&apos;s also where
        staff enthusiasm goes to die, which in my experience is the more
        fatal of the two.
      </p>
      <p>
        This is the problem we built{" "}
        <a
          href="https://tendivohealth.com/clinics"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tendivo Health
        </a>{" "}
        around at JMCB: the enrollment, monitoring, and audit-ready
        documentation workflow, so a small practice can run RPM and CCM
        without hiring for it.
      </p>

      <h2>The window is open</h2>
      <p>
        Here&apos;s my honest read. The practices that build a disciplined
        program in 2026 will treat it as ordinary operations by 2027, the
        same way e-prescribing went from novelty to furniture. The removal
        of the 16-day and 20-minute floors took away the best excuse for
        waiting. What&apos;s left is a workflow problem, and workflow
        problems are solvable on purpose.
      </p>
      <p>
        If you run a small practice and want to talk through what this
        would look like with your patient panel and your staffing,{" "}
        <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
          book a call
        </a>
        . Bring your Medicare patient count and your front office headcount.
        That&apos;s enough to sketch the whole program on one page.
      </p>
    </>
  );
}
