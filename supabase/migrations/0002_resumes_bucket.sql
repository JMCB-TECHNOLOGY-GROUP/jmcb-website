-- ============================================================
-- 0002_resumes_bucket.sql — private storage bucket for CV uploads
--
-- Career Compass (/career-assessment) stores the original CV a job seeker
-- uploads. The bucket is created here rather than by hand in the dashboard so
-- it is version controlled, repeatable across environments, and applied with
--   npx supabase db push
--
-- PRIVACY: this holds other people's personal data, so `public` is false and
-- no RLS policy is granted to anon or authenticated. The application reaches
-- it only through the service role key (which bypasses RLS) and hands out
-- nothing but short-lived signed URLs. Do not make this bucket public, and do
-- not add a permissive select policy to it.
--
-- Until this migration is applied the application still works: CV upload,
-- extraction and results all succeed, the original simply is not retained
-- (see the storage note in src/app/api/career-assessment/resume/route.ts).
--
-- Idempotent, in keeping with 0001_baseline.sql.
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes',
  'resumes',
  false,
  -- 2.5MB, matching MAX_RESUME_BYTES in src/lib/resume.ts. Enforced here too
  -- so a client that skips the browser-side check still cannot overfill it.
  2621440,
  -- Must stay in step with EXTENSION_MIME in src/lib/document-formats.ts —
  -- a type missing here is rejected at upload.
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-word.document.macroEnabled.12',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    'application/msword',
    'application/vnd.oasis.opendocument.text',
    'application/rtf',
    'text/plain',
    'text/markdown'
  ]
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
