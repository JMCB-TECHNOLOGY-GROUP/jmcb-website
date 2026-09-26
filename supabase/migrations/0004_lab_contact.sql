-- Lab: required contact step. Phone already exists on lab_students (copied
-- from the application, where it was optional until 24 Sep 2026); every
-- student confirms it here, so contact_confirmed_at, not phone, marks the
-- step done.

ALTER TABLE lab_students ADD COLUMN IF NOT EXISTS sms_ok BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE lab_students ADD COLUMN IF NOT EXISTS preferred_contact TEXT
  CHECK (preferred_contact IN ('text', 'whatsapp', 'call', 'email'));
ALTER TABLE lab_students ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE lab_students ADD COLUMN IF NOT EXISTS contact_confirmed_at TIMESTAMPTZ;
