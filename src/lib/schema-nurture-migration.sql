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
