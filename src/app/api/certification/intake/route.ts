import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/send-email";
import { isLikelyBot } from "@/lib/bot-check";
import { certificationIntakeSchema, formatIssues } from "@/lib/validation";
import { logError, logInfo } from "@/lib/logger";
import { SPRINT, TRACK_NAME, examLabel } from "@/lib/certification";

// public endpoint: certification track intake from /certification/intake —
// the link is sent to people we have already spoken to, but it has no token,
// so it gets the same guards as the other public forms: per-IP rate limit,
// bot heuristics, zod validation, service-role writes only.
//
// Intakes land in `leads` with source "certification_intake" and status "new"
// (the status column is CHECK-constrained); onboarding stages after that are tracked by hand
// (see docs/certification-track/workflow.md).

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`cert-intake:${ip}`, 5, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests, slow down" },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const body = await request.json();

    const botReason = isLikelyBot(body);
    if (botReason) {
      logInfo("cert-intake", "dropped bot submission", { reason: botReason, ip });
      return NextResponse.json({ success: true });
    }

    const parsed = certificationIntakeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: formatIssues(parsed.error) }, { status: 400 });
    }
    const d = parsed.data;
    const isAssociate = d.path === "associate";

    const rows: [string, string][] = [
      ["Path", isAssociate ? "JMCB Associate (invited)" : `${SPRINT.name} (paid)`],
      ["Exam", examLabel(d.exam)],
      ["Target exam date", d.targetExamDate || "—"],
      ["Phone", d.phone],
      ["Texts OK", d.smsOk ? "yes" : "no"],
      ["Preferred contact", d.preferredContact],
      ["Location", d.location],
      ["Time zone", d.timezone],
      ["Experience", d.experience],
      ["Hours per week", String(d.hoursPerWeek)],
      ["Organisation / role", `${d.organization || "—"} — ${d.role || "—"}`],
      ["LinkedIn", d.linkedin || "—"],
      ["GitHub", d.github || "—"],
      ...(isAssociate
        ? ([["Requested jmcbtech.com address", d.addressRequest ? `${d.addressRequest}@jmcbtech.com` : "—"]] as [string, string][])
        : []),
    ];

    const note = [
      `[${TRACK_NAME} intake — ${new Date().toISOString()}]`,
      ...rows.map(([k, v]) => `${k}: ${v}`),
      "",
      `Goal:\n${d.goal}`,
    ].join("\n");

    const supabase = createServerClient();
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id, notes")
      .eq("email", d.email.toLowerCase())
      .single();

    if (existingLead) {
      // Append only — the person is usually already a cohort applicant, and
      // their original source must survive.
      await supabase
        .from("leads")
        .update({
          notes: existingLead.notes ? `${existingLead.notes}\n\n${note}` : note,
          phone: d.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingLead.id);
    } else {
      await supabase.from("leads").insert({
        email: d.email.toLowerCase(),
        first_name: d.firstName,
        last_name: d.lastName,
        organization: d.organization || null,
        role: d.role || null,
        phone: d.phone,
        source: "certification_intake",
        status: "new",
        notes: note,
      });
    }

    // Saved already, so mail failures are non-fatal.
    await sendEmail(
      "jermaine@jmcbtech.com",
      `${TRACK_NAME} intake — ${d.firstName} ${d.lastName} (${isAssociate ? "Associate" : "Sprint"})`,
      `<p><strong>${esc(d.firstName)} ${esc(d.lastName)}</strong> &lt;${esc(d.email)}&gt;</p>
       <table cellpadding="4">${rows
         .map(([k, v]) => `<tr><td><strong>${esc(k)}</strong></td><td>${esc(v)}</td></tr>`)
         .join("")}</table>
       <p><strong>Goal:</strong></p>
       <p style="white-space:pre-wrap">${esc(d.goal)}</p>
       <p>Next step: ${
         isAssociate
           ? "send the associate agreement (template 3A)."
           : "send the fee and payment link (template 3S)."
       }</p>`,
      d.email
    );

    await sendEmail(
      d.email,
      `Your ${TRACK_NAME} intake is in`,
      `<p>Hi ${esc(d.firstName)},</p>
       <p>Thanks. I have your details for the <strong>${esc(TRACK_NAME)}</strong>, aiming at <strong>${esc(examLabel(d.exam))}</strong>.</p>
       <p><strong>What happens next</strong></p>
       <ul>
         ${
           isAssociate
             ? `<li>I send you the associate agreement to sign.</li>
                <li>Once it is signed, I issue your jmcbtech.com address and walk you through registering at Anthropic's Partner Academy on it.</li>`
             : `<li>I send you the Sprint fee and a payment link.</li>
                <li>Once paid, you get the study plan and we book your first coaching session.</li>`
         }
         <li>You book the exam for about ${SPRINT.weeks} weeks out. The exam fee is paid by you directly to Anthropic.</li>
       </ul>
       <p>I may text you at ${esc(d.phone)} to speed things up${d.smsOk ? "" : " — only if you tell me that is OK"}.</p>
       <p>— Jermaine Barker<br>JMCB Technology Group</p>`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("cert-intake", error);
    return NextResponse.json({ error: "Failed to submit intake" }, { status: 500 });
  }
}
