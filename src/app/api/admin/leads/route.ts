// ============================================================
// /api/admin/leads/route.ts
// Admin endpoints: list, filter, detail, update lead status
// Protected by password (env var)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "jmcb-admin-2025";

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;
  return authHeader.replace("Bearer ", "") === ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  const searchParams = request.nextUrl.searchParams;
  const leadScore = searchParams.get("lead_score");
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const action = searchParams.get("action");

  // Weekly stats
  if (action === "weekly_stats") {
    const { data, error } = await supabase.rpc("get_weekly_stats");
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ stats: data?.[0] || data });
  }

  // Single lead detail
  if (action === "detail") {
    const leadId = searchParams.get("id");
    if (!leadId) {
      return NextResponse.json({ error: "Lead ID required" }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ lead: data });
  }

  // List leads with filters
  let query = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (leadScore) query = query.eq("lead_score", leadScore);
  if (status) query = query.eq("status", status);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    leads: data,
    total: count,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

export async function PATCH(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  const body = await request.json();
  const { leadId, action, details } = body;

  if (!leadId || !action) {
    return NextResponse.json(
      { error: "leadId and action required" },
      { status: 400 }
    );
  }

  // Map actions to your existing status column values
  const updateMap: Record<string, Record<string, unknown>> = {
    mark_contacted: { status: "contacted", updated_at: new Date().toISOString() },
    mark_qualified: { status: "qualified", updated_at: new Date().toISOString() },
    mark_converted: { status: "converted", updated_at: new Date().toISOString() },
    mark_unqualified: { status: "unqualified", updated_at: new Date().toISOString() },
    add_note: { notes: details, updated_at: new Date().toISOString() },
  };

  const update = updateMap[action];
  if (!update) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const { error } = await supabase.from("leads").update(update).eq("id", leadId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("admin_activity_log").insert({
    lead_id: leadId,
    action,
    details: details || null,
  });

  return NextResponse.json({ success: true });
}
