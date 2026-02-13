// ============================================================
// /api/assessment/partial/route.ts
// Saves partial completion at question 5 / resumes from token
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      firstName,
      lastName,
      organization,
      companySize,
      role,
      answersSoFar,
      currentQuestion,
      utmSource,
      utmMedium,
      utmCampaign,
    } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const supabase = createServerClient();

    // Check if partial already exists
    const { data: existing } = await supabase
      .from("partial_completions")
      .select("id, resume_token")
      .eq("email", email.toLowerCase())
      .eq("converted_to_lead", false)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from("partial_completions")
        .update({
          first_name: firstName,
          last_name: lastName,
          organization: organization || null,
          company_size: companySize,
          role,
          answers_so_far: answersSoFar || {},
          current_question: currentQuestion || 5,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select("resume_token")
        .single();

      if (error) {
        console.error("Partial update error:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        resumeToken: data?.resume_token || existing.resume_token,
        updated: true,
      });
    }

    const { data, error } = await supabase
      .from("partial_completions")
      .insert({
        email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        organization: organization || null,
        company_size: companySize,
        role,
        answers_so_far: answersSoFar || {},
        current_question: currentQuestion || 5,
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
      })
      .select("resume_token")
      .single();

    if (error) {
      console.error("Partial insert error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      resumeToken: data?.resume_token,
      created: true,
    });
  } catch (error) {
    console.error("Partial completion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("partial_completions")
      .select("*")
      .eq("resume_token", token)
      .eq("converted_to_lead", false)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      partial: {
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        organization: data.organization,
        companySize: data.company_size,
        role: data.role,
        answersSoFar: data.answers_so_far,
        currentQuestion: data.current_question,
      },
    });
  } catch (error) {
    console.error("Resume lookup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
