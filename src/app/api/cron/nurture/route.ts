// ============================================================
// CRON: Nurture email sequence
// Runs every hour via Vercel Cron
// Sends Day 1 / Day 3 / Day 7 emails based on assessment_completed_at
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { sendEmail } from "@/lib/send-email";
import { emailDay1, emailDay3, emailDay7 } from "@/lib/email-renderer";
import { PRIORITY_ACTIONS, DIMENSION_SERVICE_MAP } from "@/lib/assessment-content";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this header)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  const now = new Date();
  let sent = 0;

  // ── DAY 1 EMAILS (24-26 hours after completion) ──
  const day1Start = new Date(now.getTime() - 26 * 60 * 60 * 1000).toISOString();
  const day1End = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const { data: day1Leads } = await supabase.from("leads")
    .select("*")
    .eq("nurture_sequence_started", true)
    .eq("nurture_emails_sent", 1)
    .gte("assessment_completed_at", day1Start)
    .lte("assessment_completed_at", day1End)
    .neq("status", "unqualified")
    .limit(50);

  if (day1Leads) {
    for (const lead of day1Leads) {
      const weakest = lead.weakest_dimension || "Data Foundation";
      const weakestScore = lead.dimension_scores_v2?.[weakest] || 2;
      const svc = DIMENSION_SERVICE_MAP[weakest] || { service: "AI Strategy Session", description: "Personalized guidance for this dimension.", deliverable: "Action plan" };

      const email = emailDay1({
        firstName: lead.first_name || "there",
        organization: lead.organization || "your organization",
        weakestDimension: weakest,
        weakestScore,
        priorityAction: (PRIORITY_ACTIONS[weakest] || ["Build foundations in this area."])[0],
        service: svc.service,
        serviceDesc: svc.description,
      });

      const ok = await sendEmail(lead.email, email.subject, email.html);
      if (ok) {
        await supabase.from("leads").update({ nurture_emails_sent: 2 }).eq("id", lead.id);
        sent++;
      }
    }
  }

  // ── DAY 3 EMAILS (72-74 hours after completion) ──
  const day3Start = new Date(now.getTime() - 74 * 60 * 60 * 1000).toISOString();
  const day3End = new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString();

  const { data: day3Leads } = await supabase.from("leads")
    .select("*")
    .eq("nurture_sequence_started", true)
    .eq("nurture_emails_sent", 2)
    .gte("assessment_completed_at", day3Start)
    .lte("assessment_completed_at", day3End)
    .neq("status", "unqualified")
    .limit(50);

  if (day3Leads) {
    for (const lead of day3Leads) {
      const email = emailDay3({
        firstName: lead.first_name || "there",
        organization: lead.organization || "your organization",
        overallScore: lead.overall_score_v2 || 40,
        companySize: lead.company_size || "11-50",
      });

      const ok = await sendEmail(lead.email, email.subject, email.html);
      if (ok) {
        await supabase.from("leads").update({ nurture_emails_sent: 3 }).eq("id", lead.id);
        sent++;
      }
    }
  }

  // ── DAY 7 EMAILS (168-170 hours after completion) ──
  const day7Start = new Date(now.getTime() - 170 * 60 * 60 * 1000).toISOString();
  const day7End = new Date(now.getTime() - 168 * 60 * 60 * 1000).toISOString();

  const { data: day7Leads } = await supabase.from("leads")
    .select("*")
    .eq("nurture_sequence_started", true)
    .eq("nurture_emails_sent", 3)
    .gte("assessment_completed_at", day7Start)
    .lte("assessment_completed_at", day7End)
    .neq("status", "unqualified")
    .limit(50);

  if (day7Leads) {
    for (const lead of day7Leads) {
      const email = emailDay7({
        firstName: lead.first_name || "there",
        organization: lead.organization || "your organization",
        weakestDimension: lead.weakest_dimension || "Data Foundation",
        overallScore: lead.overall_score_v2 || 40,
      });

      const ok = await sendEmail(lead.email, email.subject, email.html);
      if (ok) {
        await supabase.from("leads").update({ nurture_emails_sent: 4 }).eq("id", lead.id);
        sent++;
      }
    }
  }

  return NextResponse.json({
    success: true,
    sent,
    checked: {
      day1: day1Leads?.length || 0,
      day3: day3Leads?.length || 0,
      day7: day7Leads?.length || 0,
    },
    timestamp: now.toISOString(),
  });
}
