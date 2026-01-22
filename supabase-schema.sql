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
