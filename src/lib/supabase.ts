import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Browser client (for client components)
export function createBrowserClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseAnonKey);
}

// Server client with service role (for API routes)
export function createServerClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Types for assessment data
export interface AssessmentDimension {
  title: string;
  score: number;
  benchmark: number;
}

export interface AssessmentRecommendation {
  title: string;
  details: string;
}

export interface AssessmentResult {
  id: string;
  user_id: string;
  assessment_type: "ai_readiness" | "career";
  score: number;
  band: "early" | "developing" | "advanced";
  answers: Record<number, number>;
  dimensions: AssessmentDimension[];
  recommendations: AssessmentRecommendation[] | null;
  created_at: string;
}

export interface User {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  organization: string | null;
  role: string | null;
  tier: "free" | "pro";
  created_at: string;
  updated_at: string;
}
