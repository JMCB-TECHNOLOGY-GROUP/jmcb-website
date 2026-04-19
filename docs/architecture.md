# Architecture

## Overview

The JMCB Technology Group website is a Next.js 14 application using the App Router pattern. It serves as both a marketing website and a lead generation platform, centered around an AI Readiness Assessment tool with an automated nurture pipeline.

## System Architecture

```
                        +------------------+
                        |     Vercel CDN   |
                        |   (Edge + SSR)   |
                        +--------+---------+
                                 |
                  +--------------+--------------+
                  |      Next.js 14 App         |
                  |      (App Router)            |
                  +--+------+------+------+-----+
                     |      |      |      |
            +--------+  +---+--+  ++-----++ +------+
            | Clerk  |  |Supa- |  |Resend| |Claude|
            | (Auth) |  |base  |  |(Mail)| | (AI) |
            +--------+  |      |  +------+ +------+
                         +--+---+
                            |
                   +--------+--------+
                   |   PostgreSQL    |
                   |   + Storage    |
                   +-----------------+

External:
  - Make.com (webhook for CRM sync)
  - Calendly (booking links)
```

## Application Layers

### Presentation Layer

- **Pages** (`src/app/*/page.tsx`): Server and client components rendering marketing pages, the assessment UI, admin dashboard, and report viewer.
- **Components** (`src/components/`): Shared UI components (Header, Footer, TrustBar).
- **Styling**: Tailwind CSS for utility-first styling, Framer Motion for animations.

### API Layer

Next.js Route Handlers in `src/app/api/` implement the backend logic:

| Route Group | Purpose |
|-------------|---------|
| `/api/leads` | Lead capture (POST) and listing (GET) |
| `/api/assessment/submit` | Full assessment pipeline (score, save, email, webhook) |
| `/api/assessment/report` | AI-generated executive summary via Claude API |
| `/api/assessment/partial` | Partial completion save and resume |
| `/api/admin/leads` | Admin lead management with password auth |
| `/api/cron/nurture` | Automated nurture email sequence |
| `/api/cron/recover` | Partial completion recovery emails |
| `/api/test-email` | Email pipeline diagnostics |
| `/api` (root) | Legacy report generation with HTML storage |

### Data Layer

- **Supabase PostgreSQL**: Primary data store for leads, assessment results, partial completions, and admin activity logs.
- **Supabase Storage**: HTML report file storage with public URL generation.
- **Supabase RPC**: Server-side functions for aggregations (weekly stats).

### Integration Layer

- **Clerk**: Authentication provider handling Google OAuth and email sign-in. Manages user sessions and provides middleware for protected routes.
- **Resend**: Transactional email delivery for assessment results, nurture sequences, and recovery emails.
- **Anthropic Claude API**: Generates AI-powered executive summaries and personalized recommendations for assessment reports.
- **Make.com**: Receives webhook payloads on new assessment submissions for CRM sync and external automation.

## Key Data Models

### Leads Table

The central table storing all captured leads and their assessment data:

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `email` | text | Unique, lowercase |
| `first_name`, `last_name` | text | Contact name |
| `organization` | text | Company name |
| `role` | text | Job role |
| `company_size` | text | Company size bracket |
| `assessment_score` | integer | Legacy score (0-50) |
| `assessment_band` | text | `early`, `developing`, `advanced` |
| `overall_score_v2` | integer | V2 score (0-100) |
| `dimension_scores_v2` | jsonb | Per-dimension scores |
| `lead_score` | text | Computed lead quality |
| `nurture_emails_sent` | integer | Count of nurture emails sent |
| `status` | text | Lead status in pipeline |

### Assessment Results Table

Normalized assessment data linked to leads:

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `lead_id` | uuid | Foreign key to leads |
| `assessment_type` | text | Assessment identifier |
| `score` | integer | Raw score |
| `band` | text | Score band |
| `answers` | jsonb | All question responses |
| `dimensions` | jsonb | Dimension breakdowns |
| `recommendations` | jsonb | Generated recommendations |

### Partial Completions Table

Tracks abandoned assessments for recovery:

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `email` | text | Contact email |
| `resume_token` | text | Unique token for resuming |
| `answers_so_far` | jsonb | Partial answers |
| `current_question` | integer | Where they stopped |
| `converted_to_lead` | boolean | Whether they completed later |
| `reminder_sent` | boolean | Whether recovery email was sent |

## Assessment Pipeline

The assessment submission endpoint (`/api/assessment/submit`) orchestrates a multi-step pipeline:

1. **Score calculation**: Compute overall score (0-100) and per-dimension scores from answers, adjusted for company size.
2. **Lead scoring**: Rate lead quality based on role seniority, company size, and assessment patterns.
3. **Report generation**: Build recommendations, priority actions, and service mappings based on weakest dimensions.
4. **Database persistence**: Upsert lead record, create assessment result, mark partial completions as converted. Failure here does not block subsequent steps.
5. **Email delivery**: Send Day 0 results email to the lead and notification email to the business owner. Each email is independent.
6. **Webhook dispatch**: Fire Make.com webhook asynchronously (non-blocking).
7. **Response**: Return full results to the client for immediate display.

## Nurture Sequence

Vercel cron jobs run hourly to send timed follow-up emails:

| Email | Timing | Content |
|-------|--------|---------|
| Day 0 | Immediate (in submit pipeline) | Assessment results and initial recommendations |
| Day 1 | 24 hours post-assessment | Deep dive on weakest dimension |
| Day 3 | 72 hours post-assessment | Peer comparison and case study |
| Day 7 | 168 hours post-assessment | Final follow-up with consultation CTA |
| Recovery | 2 hours post-abandonment | Resume link for partial completions |

## Security Considerations

- **Authentication**: Clerk handles all auth flows. No custom auth implementation.
- **Database access**: Supabase service role key is server-only (never exposed to client).
- **Admin routes**: Protected by password in Authorization header (env var).
- **Cron routes**: Protected by `CRON_SECRET` matching Vercel's cron header.
- **Input validation**: Email format validation on lead capture. Required field checks on all endpoints.
- **Known gaps**: No rate limiting on public endpoints (documented tech debt). Admin auth uses a static password rather than Clerk roles.
