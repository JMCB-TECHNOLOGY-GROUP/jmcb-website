import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/send-email";
import { isLikelyBot } from "@/lib/bot-check";
import { programApplicationSchema, formatIssues } from "@/lib/validation";
import { logError, logInfo } from "@/lib/logger";
import { COHORT, PROGRAM_NAME, SESSION_DAY, SESSION_TIME, formatSessionDate } from "@/lib/program";

// public endpoint: anonymous programme applications from /program — public by
// design (applicants have no account, and the whole point of a free community
// programme is a low barrier). Same guards as the other public forms: per-IP
// rate limit, bot heuristics, zod validation, service-role writes only.
//
// Applications land in `leads` with source "program_application"; the answers
// go in `notes` because the table has no per-programme columns and adding
// some for a form this size is not worth the migration.

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`program-apply:${ip}`, 5, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests, slow down" },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const body = await request.json();

    // Silently drop bot submissions — success shape, no persistence, so
    // scripts get no feedback signal.
    const botReason = isLikelyBot(body);
    if (botReason) {
      logInfo("program-apply", "dropped bot submission", { reason: botReason, ip });
      return NextResponse.json({ success: true });
    }

    const parsed = programApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: formatIssues(parsed.error) }, { status: 400 });
    }
    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      organization,
      role,
      realTask,
      motivation,
      tier,
      canAttend,
      referral,
    } = parsed.data;

    const note = [
      `[${PROGRAM_NAME} application — ${COHORT.label} — ${new Date().toISOString()}]`,
      `Location: ${location || "—"}`,
      `Can attend ${SESSION_DAY}s ${SESSION_TIME}: ${canAttend ? "yes" : "not confirmed"}`,
      `Interested in capstone: ${tier === "capstone_interest" ? "yes" : "no"}`,
      `Heard about it via: ${referral || "—"}`,
      "",
      `Real recurring task:\n${realTask}`,
      motivation ? `\nWhy this programme:\n${motivation}` : "",
    ]
      .join("\n")
      .trim();

    const supabase = createServerClient();
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id, notes")
      .eq("email", email.toLowerCase())
      .single();

    if (existingLead) {
      // Never overwrite an existing lead's source or details — an applicant
      // may already be a contact or an assessment respondent. Append only.
      await supabase
        .from("leads")
        .update({
          notes: existingLead.notes ? `${existingLead.notes}\n\n${note}` : note,
          phone: phone || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingLead.id);
    } else {
      await supabase.from("leads").insert({
        email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        organization: organization || null,
        role: role || null,
        phone: phone || null,
        source: "program_application",
        status: "new",
        notes: note,
      });
    }

    // The application is already saved, so mail failures are non-fatal.
    await sendEmail(
      "jermaine@jmcbtech.com",
      `${PROGRAM_NAME} application — ${firstName} ${lastName}`,
      `<p><strong>Applicant:</strong> ${esc(firstName)} ${esc(lastName)} &lt;${esc(email)}&gt;</p>
       <p><strong>Location:</strong> ${esc(location || "—")}<br>
          <strong>Organisation / role:</strong> ${esc(organization || "—")} — ${esc(role || "—")}<br>
          <strong>Can attend ${esc(SESSION_DAY)}s:</strong> ${canAttend ? "yes" : "not confirmed"}<br>
          <strong>Capstone interest:</strong> ${tier === "capstone_interest" ? "yes" : "no"}<br>
          <strong>Referral:</strong> ${esc(referral || "—")}</p>
       <p><strong>Real recurring task:</strong></p>
       <p style="white-space:pre-wrap">${esc(realTask)}</p>
       ${motivation ? `<p><strong>Why:</strong></p><p style="white-space:pre-wrap">${esc(motivation)}</p>` : ""}`,
      email
    );

    await sendEmail(
      email,
      `Your ${PROGRAM_NAME} application is in`,
      `<p>Hi ${esc(firstName)},</p>
       <p>Your application for <strong>${esc(PROGRAM_NAME)}</strong> (${esc(COHORT.label)}) has been received. Thank you for taking the time to write out a real task — that answer is the part I actually read.</p>
       <p><strong>What happens next</strong></p>
       <ul>
         <li>Applications close <strong>${esc(formatSessionDate(COHORT.applicationsClose))}</strong>.</li>
         <li>There is a live information session on <strong>${esc(formatSessionDate(COHORT.infoSession))}</strong>, ${esc(SESSION_TIME)} — come with questions.</li>
         <li>Everyone hears back within a week of applications closing, accepted or not.</li>
         <li>The cohort runs ${esc(SESSION_DAY)}s, ${esc(SESSION_TIME)}, from ${esc(formatSessionDate(COHORT.startDate))} to ${esc(formatSessionDate(COHORT.endDate))}.</li>
       </ul>
       <p>In the meantime: keep an eye on that task. Time it for a week if you can. You will need the baseline in week one.</p>
       <p>— Jermaine Barker<br>JMCB Technology Group</p>`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("program-apply", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
