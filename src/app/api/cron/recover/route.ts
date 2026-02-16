// ============================================================
// CRON: Partial completion recovery
// Runs every hour via Vercel Cron
// Sends recovery email 2 hours after someone abandons at Q5
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { sendEmail } from "@/lib/send-email";
import { emailPartialRecovery } from "@/lib/email-renderer";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  const now = new Date();
  let sent = 0;

  // Find partials from 2-4 hours ago that haven't converted or been reminded
  const windowStart = new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString();
  const windowEnd = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();

  const { data: partials } = await supabase.from("partial_completions")
    .select("*")
    .eq("converted_to_lead", false)
    .eq("reminder_sent", false)
    .gte("created_at", windowStart)
    .lte("created_at", windowEnd)
    .limit(50);

  if (partials) {
    for (const p of partials) {
      if (!p.email || !p.resume_token) continue;

      const email = emailPartialRecovery({
        firstName: p.first_name || "there",
        resumeToken: p.resume_token,
        questionsAnswered: p.current_question || 5,
      });

      const ok = await sendEmail(p.email, email.subject, email.html);
      if (ok) {
        await supabase.from("partial_completions")
          .update({ reminder_sent: true })
          .eq("id", p.id);
        sent++;
      }
    }
  }

  return NextResponse.json({
    success: true,
    sent,
    checked: partials?.length || 0,
    timestamp: now.toISOString(),
  });
}
