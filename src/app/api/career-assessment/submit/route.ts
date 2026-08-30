import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/send-email";
import { isLikelyBot } from "@/lib/bot-check";
import { careerAssessmentSchema, formatIssues } from "@/lib/validation";
import { logError, logInfo } from "@/lib/logger";
import {
  ASSESSMENT_NAME,
  PREFERENCE_FIELDS,
  getBand,
} from "@/lib/career-assessment";
import { flattenSkills } from "@/lib/resume";
import {
  PROGRAM_NAME,
  COHORT,
  SESSION_DAY,
  SESSION_TIME,
  formatSessionDate,
} from "@/lib/program";

// public endpoint: anonymous Career Compass submission — public by design
// (job seekers have no account). Same guards as the other public forms:
// per-IP rate limit, bot heuristics, zod validation, service-role writes.
//
// Storage note: this writes to the existing `leads` table with
// source "career_assessment" and needs no migration. The scored COMPASS data
// fits the generic assessment_* columns; the preference capture — the part
// Jermaine actually reads — is rendered into `notes`. assessment_band is
// CHECK-constrained to early/developing/advanced, so we store the band's
// `legacy` value there and keep the richer label in the notes block.

const JERMAINE_EMAIL = process.env.JERMAINE_EMAIL || "jermaine@jmcbtech.com";

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Turn stored option ids back into the labels a human wants to read. */
function labelFor(fieldId: string, value: string | string[]): string {
  const field = PREFERENCE_FIELDS.find((f) => f.id === fieldId);
  if (!field) return Array.isArray(value) ? value.join(", ") : String(value);
  const lookup = (v: string) => field.options.find((o) => o.value === v)?.label ?? v;
  return Array.isArray(value) ? value.map(lookup).join(", ") : lookup(value);
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`career-assessment:${ip}`, 5, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests, slow down" },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const body = await request.json();

    const botReason = isLikelyBot(body);
    if (botReason) {
      logInfo("career-assessment", "dropped bot submission", { reason: botReason, ip });
      return NextResponse.json({ success: true });
    }

    const parsed = careerAssessmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: formatIssues(parsed.error) }, { status: 400 });
    }
    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      targetTitle,
      preferences,
      answers,
      score,
      dimensions,
      complete,
      joinFoundingCohort,
      resume,
      resumePath,
      utmSource,
      utmMedium,
      utmCampaign,
    } = parsed.data;

    const band = getBand(score);

    // A founding place is earned by finishing the assessment AND asked for by
    // ticking the box. Never infer consent from completion alone.
    const registeredFounding = Boolean(complete && joinFoundingCohort);

    // The preference block is the point of this assessment — render it in the
    // order the questions were asked so it reads like the form.
    const preferenceLines = PREFERENCE_FIELDS.filter((f) => preferences[f.id]).map(
      (f) => `${f.question}\n  → ${labelFor(f.id, preferences[f.id])}`
    );

    const skills = flattenSkills(resume);

    // Read back the stored CV for the alert email. Signed rather than public,
    // and short-lived — see the storage note in the resume route.
    let resumeUrl: string | null = null;

    const resumeLines = resume
      ? [
          "",
          "CV",
          resume.contact?.linkedin ? `  LinkedIn: ${resume.contact.linkedin}` : null,
          resume.currentTitle ? `  Current title: ${resume.currentTitle}` : null,
          resume.yearsExperience != null ? `  Years of experience: ${resume.yearsExperience}` : null,
          resume.industries?.length ? `  Industries: ${resume.industries.join(", ")}` : null,
          skills.length ? `  Skills: ${skills.join(", ")}` : null,
          resume.quantifiedAchievements?.length
            ? `  Already quantified:\n${resume.quantifiedAchievements.map((a) => `    - ${a}`).join("\n")}`
            : null,
          resume.atsIssues?.length
            ? `  CV problems:\n${resume.atsIssues.map((a) => `    - ${a}`).join("\n")}`
            : null,
          resume.missingForTarget?.length
            ? `  Missing for their target: ${resume.missingForTarget.join(", ")}`
            : null,
        ].filter((l) => l !== null)
      : ["", "CV: not provided"];

    const note = [
      `[${ASSESSMENT_NAME} — ${new Date().toISOString()}]`,
      `Score: ${score}/100 (${band.label})`,
      `Completed all questions: ${complete ? "yes" : "no"}`,
      `Founding cohort: ${registeredFounding ? `REGISTERED for ${COHORT.label}` : "not requested"}`,
      location ? `Location: ${location}` : null,
      targetTitle ? `Exact title they want: ${targetTitle}` : null,
      utmSource || utmMedium || utmCampaign
        ? `Source: ${[utmSource, utmMedium, utmCampaign].filter(Boolean).join(" / ")}`
        : null,
      "",
      "WHAT THEY WANT",
      ...preferenceLines,
      "",
      "COMPASS",
      ...Object.entries(dimensions ?? {}).map(([d, v]) => `  ${d}: ${v}/5`),
      ...resumeLines,
    ]
      .filter((l) => l !== null)
      .join("\n");

    const supabase = createServerClient();
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id, notes")
      .eq("email", email.toLowerCase())
      .single();

    const scoreFields = {
      assessment_score: score,
      assessment_band: band.legacy,
      assessment_answers: answers,
      assessment_dimensions: dimensions ? [dimensions] : null,
      phone: phone || null,
      updated_at: new Date().toISOString(),
    };

    if (existingLead) {
      // Append rather than overwrite — this person may already be a contact or
      // an org-assessment respondent, and that history matters.
      await supabase
        .from("leads")
        .update({
          ...scoreFields,
          notes: existingLead.notes ? `${existingLead.notes}\n\n${note}` : note,
        })
        .eq("id", existingLead.id);
    } else {
      await supabase.from("leads").insert({
        email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        source: registeredFounding ? "career_assessment_founding" : "career_assessment",
        status: "new",
        notes: note,
        ...scoreFields,
      });
    }

    if (resumePath) {
      try {
        const { data: signed } = await supabase.storage
          .from("resumes")
          .createSignedUrl(resumePath, 60 * 60 * 24 * 7);
        resumeUrl = signed?.signedUrl ?? null;
      } catch {
        // A missing bucket must not cost us the alert email.
      }
    }

    // ── Alert Jermaine. The lead is saved, so mail failure is non-fatal. ──
    const subject = registeredFounding
      ? `FOUNDING COHORT — ${firstName} ${lastName} (${score}/100)`
      : `${ASSESSMENT_NAME} — ${firstName} ${lastName} (${score}/100)`;

    await sendEmail(
      JERMAINE_EMAIL,
      subject,
      `<p><strong>${esc(firstName)} ${esc(lastName)}</strong> &lt;${esc(email)}&gt;${
        phone ? ` · ${esc(phone)}` : ""
      }</p>
       <p><strong>Score:</strong> ${score}/100 — ${esc(band.label)}<br>
          <strong>Completed all questions:</strong> ${complete ? "yes" : "no"}<br>
          <strong>Founding cohort:</strong> ${
            registeredFounding
              ? `<strong style="color:#B45309">REGISTERED for ${esc(COHORT.label)} — contact them</strong>`
              : "not requested"
          }<br>
          ${location ? `<strong>Location:</strong> ${esc(location)}<br>` : ""}
          ${targetTitle ? `<strong>Wants the title:</strong> ${esc(targetTitle)}` : ""}</p>
       <h3 style="margin-bottom:4px">What they want</h3>
       <ul style="margin-top:0">
         ${PREFERENCE_FIELDS.filter((f) => preferences[f.id])
           .map(
             (f) =>
               `<li><strong>${esc(f.question)}</strong><br>${esc(
                 labelFor(f.id, preferences[f.id])
               )}</li>`
           )
           .join("")}
       </ul>
       ${
         resume
           ? `<h3 style="margin-bottom:4px">Their CV</h3>
              <p style="margin-top:0">
                ${resume.contact?.linkedin ? `<strong>LinkedIn:</strong> ${esc(resume.contact.linkedin)}<br>` : ""}
                ${resume.currentTitle ? `<strong>Now:</strong> ${esc(resume.currentTitle)}<br>` : ""}
                ${resume.yearsExperience != null ? `<strong>Experience:</strong> ${resume.yearsExperience} years<br>` : ""}
                ${resume.industries?.length ? `<strong>Industries:</strong> ${esc(resume.industries.join(", "))}<br>` : ""}
                ${skills.length ? `<strong>Skills:</strong> ${esc(skills.join(", "))}<br>` : ""}
                ${resume.missingForTarget?.length ? `<strong>Missing for their target:</strong> ${esc(resume.missingForTarget.join(", "))}<br>` : ""}
                ${resumeUrl ? `<a href="${resumeUrl}">Open their CV</a> (link expires in 7 days)` : ""}
              </p>`
           : "<p><em>No CV provided.</em></p>"
       }
       <h3 style="margin-bottom:4px">COMPASS</h3>
       <ul style="margin-top:0">
         ${Object.entries(dimensions ?? {})
           .map(([d, v]) => `<li>${esc(d)}: ${esc(String(v))}/5</li>`)
           .join("")}
       </ul>`,
      email
    );

    // ── Confirm to the applicant. ──
    await sendEmail(
      email,
      registeredFounding
        ? `You're in — ${PROGRAM_NAME} founding cohort`
        : `Your ${ASSESSMENT_NAME} results`,
      `<p>Hi ${esc(firstName)},</p>
       <p>You scored <strong>${score} out of 100</strong> on the ${esc(ASSESSMENT_NAME)} — ${esc(
         band.label
       )}.</p>
       <p>${esc(band.summary)}</p>
       ${
         registeredFounding
           ? `<p><strong>Your place in the ${esc(PROGRAM_NAME)} founding cohort is reserved.</strong>
                You finished every question, which is the bar. I'll be in touch personally before we start.</p>
              <ul>
                <li>Runs ${esc(SESSION_DAY)}s, ${esc(SESSION_TIME)}</li>
                <li>${esc(formatSessionDate(COHORT.startDate))} to ${esc(formatSessionDate(COHORT.endDate))}</li>
                <li>Free. Eight weeks, eight real projects, published portfolio at the end.</li>
              </ul>
              <p>Before week one, start timing the task you named. You'll need the baseline.</p>`
           : `<p>If you want the eight-week programme that closes these gaps, ${esc(
               PROGRAM_NAME
             )} is free and applications are open: https://www.jmcbtech.com/program</p>`
       }
       <p>— Jermaine Barker<br>JMCB Technology Group</p>`
    );

    return NextResponse.json({ success: true, registeredFounding });
  } catch (error) {
    logError("career-assessment", error);
    return NextResponse.json({ success: false, error: "Failed to submit" }, { status: 500 });
  }
}
