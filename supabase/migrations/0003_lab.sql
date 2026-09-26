-- Proof of Work Lab: cohort LMS (/lab/[token], /admin/lab).
--
-- Students reach their portal through a private link. Only the SHA-256 of the
-- token is stored, so a database read does not reveal working links. Both
-- tables are service-role only: RLS on, no policies.

CREATE TABLE IF NOT EXISTS lab_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  cohort TEXT NOT NULL DEFAULT 'cohort-1',
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  real_task TEXT,
  token_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'invited'
    CHECK (status IN ('invited', 'active', 'withdrawn', 'completed')),
  invited_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,

  -- Onboarding
  github_username TEXT,
  github_verified_at TIMESTAMPTZ,
  intro TEXT,
  linkedin TEXT,
  target_role TEXT,
  role_postings JSONB NOT NULL DEFAULT '[]'::jsonb,  -- [{url, title, company}]
  role_skills TEXT,                                  -- skills repeated across postings
  route TEXT CHECK (route IN ('pl400', 'claude_arch')),
  route_reason TEXT,
  route_chosen_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  payment_ref TEXT,
  agreement_signed_at TIMESTAMPTZ,
  agreement_signature TEXT,
  address_request TEXT,
  jmcb_address TEXT,
  jmcb_address_issued_at TIMESTAMPTZ,

  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cohort, email)
);

CREATE TABLE IF NOT EXISTS lab_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES lab_students(id) ON DELETE CASCADE,
  week INT NOT NULL CHECK (week BETWEEN 1 AND 8),
  track TEXT NOT NULL CHECK (track IN ('core', 'pl400', 'claude_arch')),
  url TEXT,
  body TEXT,
  feedback TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, week, track)
);

CREATE INDEX IF NOT EXISTS idx_lab_students_cohort ON lab_students (cohort);
CREATE INDEX IF NOT EXISTS idx_lab_submissions_student ON lab_submissions (student_id);

ALTER TABLE lab_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_submissions ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS lab_students_updated_at ON lab_students;
CREATE TRIGGER lab_students_updated_at BEFORE UPDATE ON lab_students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS lab_submissions_updated_at ON lab_submissions;
CREATE TRIGGER lab_submissions_updated_at BEFORE UPDATE ON lab_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
