# JMCB Technology Group Website — Development Guide

## Overview
The corporate website for JMCB Technology Group. Features AI readiness assessments, lead capture, service pages, and an admin dashboard.

## Tech Stack
- **Framework:** Next.js 14 (App Router) + TypeScript
- **Auth:** Clerk (Google OAuth + email)
- **Database:** Supabase (PostgreSQL)
- **Email:** Resend
- **Webhooks:** Svix
- **Analytics:** Vercel Speed Insights
- **Styling:** Tailwind CSS
- **Hosting:** Vercel

## Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
```

## Project Structure
```
src/
  app/               # Pages (assessment, admin, enterprise, healthcare, services)
  app/api/           # API routes (lead capture, AI assessment generation)
  Lib/               # NOTE: Capital L — Supabase client, email utils, DB types
  components/        # React components
```

**Known issue:** `src/Lib/` uses a capital L — inconsistent with convention. Should be lowercase `src/lib/` in future refactor.

## CV Parsing (Career Compass)

`/api/career-assessment/resume` reads an uploaded CV in PDF, Word (`.docx`,
`.doc`), OpenDocument, RTF or plain text.

- `src/lib/document-formats.ts` is **client-safe**: extensions, format
  detection and whitespace normalisation, with no parser imports.
- `src/lib/document-text.ts` is **server only** and does the parsing. Never
  import it from a client component — webpack will try to bundle Node's `fs`
  and the build fails.
- `pdf-parse`, `word-extractor` and `mammoth` are listed in
  `experimental.serverComponentsExternalPackages` in `next.config.mjs`.
  `pdf-parse` resolves pdfjs's worker relative to its own package, so bundling
  it breaks at runtime with "Setting up fake worker failed". Do not remove
  them from that list.
- Everything the model returns about a CV is checked against the extracted
  text (`verifyExtraction`, `verifyRewrites` in `src/lib/resume.ts`) and
  dropped when it cannot be traced back to the document.

## Key Features
- **AI Readiness Assessment:** Generates HTML reports via Claude API, stores in Supabase Storage
- **Lead Capture:** POST /api/leads — validates email, stores lead + assessment data
- **Admin Dashboard:** View leads and assessment results
- **Service Pages:** Healthcare, Enterprise, general services

## Database
- Schema in `supabase-schema.sql` (also duplicated in `src/Lib/`)
- Tables: leads, assessment_results, reports
- No versioned migrations yet — needs migration setup

## Security Notes
- Clerk handles all authentication — do not build custom auth
- Supabase service role key is server-only
- Public endpoints (/api/leads) need rate limiting (not yet implemented)
- Admin routes should be protected by Clerk auth middleware

## Environment
Requires `.env.local` (see `.env.local.example`):
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
NEXT_PUBLIC_APP_URL=...
```

## Known Technical Debt
1. `src/Lib/` capitalization — should be lowercase
2. Duplicate schema file (root + src/Lib/) — consolidate to `supabase/migrations/`
3. No rate limiting on public API endpoints
4. No structured logging (only console.error)
5. No test suite
6. README.md is boilerplate — needs rewrite
