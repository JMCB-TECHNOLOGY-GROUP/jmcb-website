import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase";

// GET - Retrieve user's assessment history
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerClient();

    // Get user from database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get assessment results
    const { data: results, error: resultsError } = await supabase
      .from("assessment_results")
      .select("*")
      .eq("user_id", userData.id)
      .order("created_at", { ascending: false });

    if (resultsError) {
      console.error("Error fetching results:", resultsError);
      return NextResponse.json(
        { error: "Failed to fetch results" },
        { status: 500 }
      );
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("GET assessments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Save a new assessment result
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      assessment_type,
      score,
      band,
      answers,
      dimensions,
      recommendations,
      organization,
      role,
    } = body;

    // Validate required fields
    if (!assessment_type || score === undefined || !band || !answers || !dimensions) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Get or create user
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError || !userData) {
      // User doesn't exist yet, they need to be created via webhook
      return NextResponse.json(
        { error: "User not found. Please try again." },
        { status: 404 }
      );
    }

    // Update user organization and role if provided
    if (organization || role) {
      const updateData: Record<string, string> = {};
      if (organization) updateData.organization = organization;
      if (role) updateData.role = role;

      await supabase
        .from("users")
        .update(updateData)
        .eq("id", userData.id);
    }

    // Insert assessment result
    const { data: result, error: insertError } = await supabase
      .from("assessment_results")
      .insert({
        user_id: userData.id,
        assessment_type,
        score,
        band,
        answers,
        dimensions,
        recommendations,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting result:", insertError);
      return NextResponse.json(
        { error: "Failed to save result" },
        { status: 500 }
      );
    }

    return NextResponse.json({ result }, { status: 201 });
  } catch (error) {
    console.error("POST assessment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
