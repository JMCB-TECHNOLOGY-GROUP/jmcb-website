import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      organization,
      role,
      companySize,
      phone,
      score,
      band,
      answers,
      dimensions,
    } = body;

    // Validate required fields
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Check if lead already exists
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id, email")
      .eq("email", email.toLowerCase())
      .single();

    let lead;

    if (existingLead) {
      // Update existing lead with new assessment data
      const { data, error } = await supabase
        .from("leads")
        .update({
          first_name: firstName,
          last_name: lastName,
          organization: organization || null,
          role: role || null,
          company_size: companySize || null,
          phone: phone || null,
          assessment_score: score,
          assessment_band: band,
          assessment_answers: answers,
          assessment_dimensions: dimensions,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingLead.id)
        .select()
        .single();

      if (error) throw error;
      lead = data;
    } else {
      // Create new lead
      const { data, error } = await supabase
        .from("leads")
        .insert({
          email: email.toLowerCase(),
          first_name: firstName,
          last_name: lastName,
          organization: organization || null,
          role: role || null,
          company_size: companySize || null,
          phone: phone || null,
          assessment_score: score,
          assessment_band: band,
          assessment_answers: answers,
          assessment_dimensions: dimensions,
          source: "ai_readiness_assessment",
          status: "new",
        })
        .select()
        .single();

      if (error) throw error;
      lead = data;
    }

    // Also save to assessment_results table with lead_id reference
    const { data: assessmentResult, error: assessmentError } = await supabase
      .from("assessment_results")
      .insert({
        lead_id: lead.id,
        assessment_type: "ai_readiness",
        score: score,
        band: band,
        answers: answers,
        dimensions: dimensions,
      })
      .select()
      .single();

    if (assessmentError) {
      console.error("Failed to save assessment result:", assessmentError);
      // Don't fail the request, just log it
    }

    return NextResponse.json({
      success: true,
      lead: {
        id: lead.id,
        email: lead.email,
        firstName: lead.first_name,
        lastName: lead.last_name,
      },
      assessmentId: assessmentResult?.id,
    });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json(
      { error: "Failed to save lead" },
      { status: 500 }
    );
  }
}
