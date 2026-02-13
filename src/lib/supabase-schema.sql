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
