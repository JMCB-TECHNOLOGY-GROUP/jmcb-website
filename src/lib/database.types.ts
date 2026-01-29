export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          clerk_id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          organization: string | null;
          role: string | null;
          tier: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          organization?: string | null;
          role?: string | null;
          tier?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          organization?: string | null;
          role?: string | null;
          tier?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      assessment_results: {
        Row: {
          id: string;
          user_id: string;
          assessment_type: string;
          score: number;
          band: string;
          answers: Json;
          dimensions: Json;
          recommendations: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          assessment_type: string;
          score: number;
          band: string;
          answers: Json;
          dimensions: Json;
          recommendations?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          assessment_type?: string;
          score?: number;
          band?: string;
          answers?: Json;
          dimensions?: Json;
          recommendations?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
