-- ============================================================
-- 0001_baseline.sql — JMCB-Website Supabase schema baseline
--
-- Code-derived baseline assembled from the SQL files that were
-- previously applied by hand in the Supabase SQL editor:
--   supabase-schema.sql                     (users, assessment_results)
--   src/lib/supabase-schema.sql             (leads, partial_completions,
--                                            assessment_metadata, admin_activity_log)
--   src/lib/schema-nurture-migration.sql    (nurture columns on leads)
--   src/lib/blog-schema.sql                 (blog_posts)
-- Pending verification against the linked project via
-- `npx supabase db dump --linked -f supabase/migrations/0001_baseline.sql`.
-- All statements are idempotent (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).
-- ============================================================

-- ---------- source: supabase-schema.sql ----------
-- Supabase Database Schema for JMCB Assessment SaaS
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced from Clerk via webhook)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  organization TEXT,
  role TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment Results table
CREATE TABLE IF NOT EXISTS assessment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('ai_readiness', 'career')),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 50),
  band TEXT NOT NULL CHECK (band IN ('early', 'developing', 'advanced')),
  answers JSONB NOT NULL,
  dimensions JSONB NOT NULL,
  recommendations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_user_id ON assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_created_at ON assessment_results(created_at DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Users can only view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (true);  -- We'll control access via API routes with service key

-- Allow service role full access for API routes
CREATE POLICY "Service role has full access to users" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for assessment_results table
CREATE POLICY "Users can view own results" ON assessment_results
  FOR SELECT
  USING (true);  -- We'll control access via API routes

CREATE POLICY "Service role has full access to results" ON assessment_results
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ---------- source: src/lib/supabase-schema.sql ----------
-- ============================================================
-- JMCB Assessment Overhaul: Supabase Schema Migration
-- SAFE TO RUN: Uses IF NOT EXISTS and ADD COLUMN IF NOT EXISTS
-- Run in Supabase SQL Editor
-- ============================================================

-- ── STEP 1: CREATE LEADS TABLE IF IT DOESN'T EXIST ──
-- (Your code references it but original schema.sql only has users + assessment_results)

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  organization TEXT,
  role TEXT,
  company_size TEXT,
  phone TEXT,
  assessment_score INTEGER,
  assessment_band TEXT CHECK (assessment_band IN ('early', 'developing', 'advanced')),
  assessment_answers JSONB,
  assessment_dimensions JSONB,
  source TEXT DEFAULT 'ai_readiness_assessment',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'unqualified')),
  notes TEXT,
  converted_user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── STEP 2: ADD NEW COLUMNS TO LEADS TABLE ──
-- These are the new fields for the assessment overhaul

-- Lead scoring
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_score TEXT CHECK (lead_score IN ('hot', 'warm', 'cold'));
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_score_reason TEXT;

-- Enhanced assessment data (v2 uses 0-100 scale alongside existing 0-50)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS overall_score_v2 INTEGER;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS dimension_scores_v2 JSONB;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS weakest_dimension TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS strongest_dimension TEXT;

-- Assessment completion tracking
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assessment_completed_at TIMESTAMPTZ;

-- Nurture sequence tracking
ALTER TABLE leads ADD COLUMN IF NOT EXISTS nurture_sequence_started BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS nurture_emails_sent INTEGER DEFAULT 0;

-- UTM tracking
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign TEXT;

-- Indexes for new columns
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON leads (lead_score);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Service role full access (API routes use service key)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Service role full access to leads'
  ) THEN
    CREATE POLICY "Service role full access to leads" ON leads FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;


-- ── STEP 3: FIX assessment_results TABLE ──
-- Add lead_id column if missing (your API route references it but original schema doesn't have it)

ALTER TABLE assessment_results ADD COLUMN IF NOT EXISTS lead_id UUID;
ALTER TABLE assessment_results ADD COLUMN IF NOT EXISTS recommendations JSONB;


-- ── STEP 4: PARTIAL COMPLETIONS TABLE ──
-- People who enter email at question 5 but don't finish

CREATE TABLE IF NOT EXISTS partial_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  organization TEXT,
  company_size TEXT,
  role TEXT,
  answers_so_far JSONB DEFAULT '{}'::jsonb,
  current_question INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  converted_to_lead BOOLEAN DEFAULT FALSE,
  converted_at TIMESTAMPTZ,
  resume_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  reminder_sent BOOLEAN DEFAULT FALSE,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

CREATE INDEX IF NOT EXISTS idx_partial_email ON partial_completions (email);
CREATE INDEX IF NOT EXISTS idx_partial_resume_token ON partial_completions (resume_token);

ALTER TABLE partial_completions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'partial_completions' AND policyname = 'Service role full access to partial_completions'
  ) THEN
    CREATE POLICY "Service role full access to partial_completions" ON partial_completions FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;


-- ── STEP 5: ASSESSMENT METADATA TABLE ──
-- Social proof counter and other metadata

CREATE TABLE IF NOT EXISTS assessment_metadata (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO assessment_metadata (key, value)
VALUES ('total_assessments', '{"count": 500}'::jsonb)
ON CONFLICT (key) DO NOTHING;

ALTER TABLE assessment_metadata ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'assessment_metadata' AND policyname = 'Service role full access to assessment_metadata'
  ) THEN
    CREATE POLICY "Service role full access to assessment_metadata" ON assessment_metadata FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;


-- ── STEP 6: ADMIN ACTIVITY LOG ──

CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'admin_activity_log' AND policyname = 'Service role full access to admin_activity_log'
  ) THEN
    CREATE POLICY "Service role full access to admin_activity_log" ON admin_activity_log FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;


-- ── STEP 7: USEFUL VIEWS ──

CREATE OR REPLACE VIEW lead_summary AS
SELECT
  l.id,
  l.email,
  l.first_name,
  l.last_name,
  l.organization,
  l.company_size,
  l.role,
  l.lead_score,
  l.overall_score_v2,
  l.assessment_score,
  l.weakest_dimension,
  l.strongest_dimension,
  l.status,
  l.assessment_completed_at,
  l.nurture_emails_sent,
  l.created_at
FROM leads l
ORDER BY
  CASE l.lead_score
    WHEN 'hot' THEN 1
    WHEN 'warm' THEN 2
    WHEN 'cold' THEN 3
    ELSE 4
  END,
  l.created_at DESC;


-- ── STEP 8: WEEKLY STATS FUNCTION ──

CREATE OR REPLACE FUNCTION get_weekly_stats()
RETURNS TABLE (
  total_leads_this_week BIGINT,
  hot_leads_this_week BIGINT,
  warm_leads_this_week BIGINT,
  cold_leads_this_week BIGINT,
  booked_this_week BIGINT,
  avg_score_this_week NUMERIC,
  partial_completions_this_week BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE l.created_at >= date_trunc('week', NOW())),
    COUNT(*) FILTER (WHERE l.lead_score = 'hot' AND l.created_at >= date_trunc('week', NOW())),
    COUNT(*) FILTER (WHERE l.lead_score = 'warm' AND l.created_at >= date_trunc('week', NOW())),
    COUNT(*) FILTER (WHERE l.lead_score = 'cold' AND l.created_at >= date_trunc('week', NOW())),
    COUNT(*) FILTER (WHERE l.status = 'qualified' AND l.created_at >= date_trunc('week', NOW())),
    AVG(l.overall_score_v2) FILTER (WHERE l.created_at >= date_trunc('week', NOW())),
    (SELECT COUNT(*) FROM partial_completions pc WHERE pc.created_at >= date_trunc('week', NOW()))
  FROM leads l;
END;
$$ LANGUAGE plpgsql;

-- ---------- source: src/lib/schema-nurture-migration.sql ----------
-- ============================================================
-- NURTURE TRACKING: Additional columns for autonomous emails
-- Safe to run multiple times (IF NOT EXISTS)
-- Run in Supabase SQL Editor AFTER the main schema migration
-- ============================================================

-- Ensure nurture tracking columns exist
ALTER TABLE leads ADD COLUMN IF NOT EXISTS nurture_sequence_started BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS nurture_emails_sent INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assessment_completed_at TIMESTAMPTZ;

-- Index for cron job queries
CREATE INDEX IF NOT EXISTS idx_leads_nurture ON leads (nurture_sequence_started, nurture_emails_sent, assessment_completed_at)
  WHERE nurture_sequence_started = TRUE;

-- Ensure partial_completions has reminder_sent
ALTER TABLE partial_completions ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE;

-- Index for recovery cron
CREATE INDEX IF NOT EXISTS idx_partial_recovery ON partial_completions (converted_to_lead, reminder_sent, created_at)
  WHERE converted_to_lead = FALSE AND reminder_sent = FALSE;

-- ---------- source: src/lib/blog-schema.sql ----------
-- Blog posts table for jmcbtech.com/blog
-- Posts are written by the Tue/Thu content pipeline (or manually) through
-- POST /api/blog/publish, authenticated with BLOG_PUBLISH_TOKEN.

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,          -- meta description / list excerpt
  content TEXT NOT NULL,              -- markdown body
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  linkedin_personal_url TEXT,         -- set by the pipeline after cross-posting
  linkedin_company_url TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published
  ON blog_posts (status, published_at DESC);

-- RLS: the site reads/writes with the service-role key only, so lock the
-- table down for anon/authenticated roles.
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can read published posts" ON blog_posts;
CREATE POLICY "public can read published posts" ON blog_posts
  FOR SELECT USING (status = 'published');

