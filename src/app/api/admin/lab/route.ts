import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase";
import { sendEmail } from "@/lib/send-email";
import { logError } from "@/lib/logger";
import { LAB_COHORT, STUDENT_COLUMNS, checkAdmin, newToken, portalUrl } from "@/lib/lab";
import { PROGRAM_NAME, COHORT, SESSION_DAY, SESSION_TIME, formatSessionDate } from "@/lib/program";

// Admin API for the Lab roster (/admin/lab). Same ADMIN_PASSWORD bearer
// auth as /api/admin/leads.

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("seed") }),
  z.object({ action: z.literal("invite"), studentId: z.string().uuid(), send: z.boolean().default(true) }),
  z.object({ action: z.literal("mark_paid"), studentId: z.string().uuid(), ref: z.string().trim().min(1).max(200) }),
  z.object({
    action: z.literal("issue_address"),
    studentId: z.string().uuid(),
    address: z.string().trim().toLowerCase().regex(/^[a-z0-9._-]+@jmcbtech\.com$/),
  }),
  z.object({
    action: z.literal("set_status"),
    studentId: z.string().uuid(),
    status: z.enum(["invited", "active", "withdrawn", "completed"]),
  }),
  z.object({ action: z.literal("notes"), studentId: z.string().uuid(), notes: z.string().max(5000) }),
  z.object({ action: z.literal("feedback"), submissionId: z.string().uuid(), feedback: z.string().trim().min(1).max(5000) }),
]);

async function roster() {
  const supabase = createServerClient();
  const { data: students } = await supabase
    .from("lab_students")
    .select(`${STUDENT_COLUMNS}, invited_at, last_seen_at, admin_notes, payment_ref, created_at`)
    .eq("cohort", LAB_COHORT)
    .order("created_at");
  const ids = (students ?? []).map((s) => s.id);
  const { data: submissions } = ids.length
    ? await supabase
        .from("lab_submissions")
        .select("id, student_id, week, track, url, body, feedback, reviewed_at, created_at")
        .in("student_id", ids)
        .order("created_at", { ascending: false })
    : { data: [] };
  return { students: students ?? [], submissions: submissions ?? [] };
}

export async function GET(request: NextRequest) {
  if (!checkAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await roster());
}

export async function POST(request: NextRequest) {
  if (!checkAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const parsed = actionSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    const a = parsed.data;
    const supabase = createServerClient();
    let extra: Record<string, unknown> = {};

    switch (a.action) {
      case "seed": {
        // Every programme applicant becomes a roster row once. The token here
        // is a throwaway: a working link is only minted by "invite".
        const { data: leads } = await supabase
          .from("leads")
          .select("id, email, first_name, last_name, phone, notes")
          .eq("source", "program_application")
          .not("email", "ilike", "%@jmcbtech.com");
        const rows = (leads ?? []).map((l) => {
          const task = /Real recurring task:\n([\s\S]*?)(\n\nWhy this programme:|$)/.exec(l.notes || "")?.[1]?.trim() ?? null;
          return {
            lead_id: l.id,
            cohort: LAB_COHORT,
            email: String(l.email).toLowerCase(),
            first_name: l.first_name,
            last_name: l.last_name,
            phone: l.phone,
            real_task: task,
            token_hash: newToken().hash,
          };
        });
        const { data: inserted, error } = await supabase
          .from("lab_students")
          .upsert(rows, { onConflict: "cohort,email", ignoreDuplicates: true })
          .select("id");
        if (error) throw error;
        extra = { seeded: inserted?.length ?? 0 };
        break;
      }
      case "invite": {
        // Minting a new token invalidates any earlier link for this student.
        const { token, hash } = newToken();
        const { data: s, error } = await supabase
          .from("lab_students")
          .update({ token_hash: hash, invited_at: new Date().toISOString() })
          .eq("id", a.studentId)
          .select("first_name, email")
          .single();
        if (error) throw error;
        const link = portalUrl(token);
        if (a.send) {
          await sendEmail(
            s.email,
            `Your ${PROGRAM_NAME} Lab: set up before ${formatSessionDate(COHORT.startDate)}`,
            `<p>Hi ${esc(s.first_name)},</p>
             <p>This is your personal ${esc(PROGRAM_NAME)} Lab: your onboarding steps, your route, each week's lesson and where you hand in your work. Keep the link private. It is your login.</p>
             <p><a href="${link}"><strong>Open your Lab</strong></a></p>
             <p>Before ${esc(formatSessionDate(COHORT.startDate))} (${esc(SESSION_DAY)}, ${esc(SESSION_TIME)}), please:</p>
             <ol>
               <li>Create your GitHub account and add your username.</li>
               <li>Introduce yourself to the cohort.</li>
               <li>Find three real postings for the role you are aiming at.</li>
               <li>Choose your route: Microsoft Power Platform Developer (AB-400) or Claude Certified Architect.</li>
             </ol>
             <p>Payment and your jmcbtech.com address come after that, inside the Lab.</p>
             <p>— Jermaine Barker<br>JMCB Technology Group</p>`
          );
        }
        extra = { link };
        break;
      }
      case "mark_paid":
        await supabase
          .from("lab_students")
          .update({ paid_at: new Date().toISOString(), payment_ref: a.ref })
          .eq("id", a.studentId);
        break;
      case "issue_address":
        await supabase
          .from("lab_students")
          .update({ jmcb_address: a.address, jmcb_address_issued_at: new Date().toISOString() })
          .eq("id", a.studentId);
        break;
      case "set_status":
        await supabase.from("lab_students").update({ status: a.status }).eq("id", a.studentId);
        break;
      case "notes":
        await supabase.from("lab_students").update({ admin_notes: a.notes }).eq("id", a.studentId);
        break;
      case "feedback":
        await supabase
          .from("lab_submissions")
          .update({ feedback: a.feedback, reviewed_at: new Date().toISOString() })
          .eq("id", a.submissionId);
        break;
    }

    return NextResponse.json({ ...(await roster()), ...extra });
  } catch (error) {
    logError("admin-lab", error);
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
