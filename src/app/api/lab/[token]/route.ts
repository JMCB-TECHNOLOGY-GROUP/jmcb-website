import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/send-email";
import { logError } from "@/lib/logger";
import { createCheckout, studentByToken, trackFeeCents, verifyCheckout } from "@/lib/lab";
import { ROUTES } from "@/lib/lab-shared";
import { parseLabAction } from "@/lib/lab-actions";

// Student portal API. The token in the path is the credential (a private link
// emailed to each student); see lib/lab.ts. GET returns the student's state,
// POST applies one onboarding or coursework action.

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function load(token: string) {
  const student = await studentByToken(token);
  if (!student) return null;
  const supabase = createServerClient();
  const { data: submissions } = await supabase
    .from("lab_submissions")
    .select("id, week, track, url, body, feedback, reviewed_at, created_at")
    .eq("student_id", student.id)
    .order("week");
  const { data: classmates } = await supabase
    .from("lab_students")
    .select("first_name, last_name, intro, target_role, route")
    .eq("cohort", "cohort-1")
    .neq("status", "withdrawn")
    .not("intro", "is", null)
    .neq("id", student.id);
  return { student, submissions: submissions ?? [], classmates: classmates ?? [], feeCents: trackFeeCents() };
}

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const state = await load(params.token);
    if (!state) return NextResponse.json({ error: "Link not recognised" }, { status: 404 });
    const supabase = createServerClient();
    await supabase
      .from("lab_students")
      .update({ last_seen_at: new Date().toISOString(), status: state.student.status === "invited" ? "active" : state.student.status })
      .eq("id", state.student.id);
    return NextResponse.json(state);
  } catch (error) {
    logError("lab", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const rl = checkRateLimit(`lab:${getClientIp(request)}`, 30, 60_000);
    if (!rl.allowed) return NextResponse.json({ error: "Too many requests, slow down" }, { status: 429 });

    const student = await studentByToken(params.token);
    if (!student) return NextResponse.json({ error: "Link not recognised" }, { status: 404 });

    const parsed = parseLabAction(await request.json().catch(() => null));
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const a = parsed.data;
    // Contact details gate everything else: no one gets further into setup, or
    // hands in work, without a confirmed cell phone and time zone.
    if (a.action !== "contact" && !student.contact_confirmed_at) {
      return NextResponse.json({ error: "Confirm your cell phone and time zone first (step 1)." }, { status: 400 });
    }
    const supabase = createServerClient();
    const now = new Date().toISOString();
    const update = (patch: Record<string, unknown>) =>
      supabase.from("lab_students").update(patch).eq("id", student.id);

    switch (a.action) {
      case "contact":
        await update({
          phone: a.phone,
          sms_ok: a.smsOk,
          preferred_contact: a.preferredContact,
          timezone: a.timezone,
          contact_confirmed_at: now,
        });
        break;
      case "github": {
        // Public GitHub API: 200 means the account exists.
        const gh = await fetch(`https://api.github.com/users/${encodeURIComponent(a.username)}`, {
          headers: { Accept: "application/vnd.github+json", "User-Agent": "jmcbtech-lab" },
        });
        if (gh.status === 404) {
          return NextResponse.json({ error: "No GitHub account with that username. Check the spelling, or create it first." }, { status: 400 });
        }
        if (!gh.ok) return NextResponse.json({ error: "Could not reach GitHub, try again in a minute." }, { status: 502 });
        const user = await gh.json();
        await update({ github_username: user.login, github_verified_at: now });
        break;
      }
      case "intro":
        await update({ intro: a.intro, linkedin: a.linkedin || null });
        break;
      case "target_role":
        await update({ target_role: a.targetRole, role_postings: a.postings, role_skills: a.skills });
        break;
      case "route":
        await update({ route: a.route, route_reason: a.reason, route_chosen_at: now });
        break;
      case "checkout": {
        if (!student.route) return NextResponse.json({ error: "Choose your route first." }, { status: 400 });
        if (student.paid_at) return NextResponse.json({ error: "Already paid." }, { status: 400 });
        const cents = trackFeeCents();
        if (!cents) return NextResponse.json({ error: "The track fee is not open yet. Jermaine will email you." }, { status: 400 });
        const url = await createCheckout(student, params.token, cents);
        return NextResponse.json({ url });
      }
      case "verify_payment": {
        if (student.paid_at) break;
        const ok = await verifyCheckout(a.sessionId, student.id);
        if (!ok) return NextResponse.json({ error: "Payment not confirmed yet." }, { status: 400 });
        await update({ paid_at: now, payment_ref: a.sessionId });
        await sendEmail(
          "jermaine@jmcbtech.com",
          `Lab: ${student.first_name} ${student.last_name} paid the track fee`,
          `<p>${esc(student.first_name)} ${esc(student.last_name)} paid (${esc(a.sessionId)}). Route: ${esc(student.route ? ROUTES[student.route].exam : "—")}.</p>`
        );
        break;
      }
      case "agreement":
        if (!student.paid_at) return NextResponse.json({ error: "Complete the payment step first." }, { status: 400 });
        await update({ agreement_signed_at: now, agreement_signature: a.signature });
        break;
      case "address_request":
        if (!student.agreement_signed_at) {
          return NextResponse.json({ error: "Accept the associate terms first." }, { status: 400 });
        }
        await update({ address_request: a.local.toLowerCase() });
        await sendEmail(
          "jermaine@jmcbtech.com",
          `Lab: issue ${a.local.toLowerCase()}@jmcbtech.com for ${student.first_name} ${student.last_name}`,
          `<p>${esc(student.first_name)} ${esc(student.last_name)} has paid and accepted the associate terms, and requests <strong>${esc(a.local.toLowerCase())}@jmcbtech.com</strong>. Issue it, then record it in /admin/lab.</p>`
        );
        break;
      case "submit": {
        if (!a.url && !a.body) return NextResponse.json({ error: "Add a link or a write-up." }, { status: 400 });
        const { error } = await supabase
          .from("lab_submissions")
          .upsert(
            { student_id: student.id, week: a.week, track: a.track, url: a.url || null, body: a.body || null },
            { onConflict: "student_id,week,track" }
          );
        if (error) throw error;
        break;
      }
    }

    return NextResponse.json(await load(params.token));
  } catch (error) {
    logError("lab", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
