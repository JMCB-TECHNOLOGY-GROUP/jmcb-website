# Deployment Guide

The JMCB Technology Group website is deployed on Vercel with Clerk for authentication, Supabase for the database, and Resend for email delivery.

## Prerequisites

- Vercel account with the project connected to the Git repository
- Clerk application configured
- Supabase project with the schema applied
- Resend account with a verified sending domain
- Anthropic API key (optional, for AI-generated report summaries)

## Vercel Setup

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com) and import the Git repository.
2. Vercel will auto-detect Next.js and configure the build settings.
3. Framework preset: **Next.js**
4. Build command: `next build`
5. Output directory: `.next`

### 2. Environment Variables

Set the following environment variables in Vercel project settings (Settings > Environment Variables). Apply to Production, Preview, and Development as appropriate.

| Variable | Required | Environment | Description |
|----------|----------|-------------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | All | Clerk publishable key |
| `CLERK_SECRET_KEY` | Yes | All | Clerk secret key |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | All | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | All | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | All | Supabase service role key (server-only) |
| `RESEND_API_KEY` | Yes | All | Resend API key |
| `RESEND_FROM` | No | All | From address (default: `Jermaine Barker <jermaine@info.jmcbtech.com>`) |
| `ANTHROPIC_API_KEY` | No | All | Anthropic API key for Claude-generated summaries |
| `NEXT_PUBLIC_APP_URL` | Yes | All | Full app URL (e.g., `https://jmcbtech.com`) |
| `ADMIN_PASSWORD` | Yes | All | Password for admin API endpoints |
| `CRON_SECRET` | Yes | Production | Secret for Vercel cron job auth |
| `MAKE_WEBHOOK_URL` | No | All | Make.com webhook URL for CRM sync |
| `NEXT_PUBLIC_CALENDLY_LINK` | No | All | Calendly booking link |
| `JERMAINE_EMAIL` | No | All | Owner notification email address |

### 3. Cron Jobs

Create or verify `vercel.json` in the project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/nurture",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/recover",
      "schedule": "30 * * * *"
    }
  ]
}
```

This runs the nurture sequence at the top of every hour and the recovery check at 30 minutes past.

### 4. Domain Configuration

1. In Vercel project settings, go to Domains.
2. Add `jmcbtech.com` and `www.jmcbtech.com`.
3. Configure DNS records as instructed by Vercel.
4. Vercel automatically provisions SSL certificates.

## Clerk Setup

### 1. Create Application

1. Go to [clerk.com](https://clerk.com) and create a new application.
2. Enable sign-in methods: Google OAuth and Email.
3. Copy the publishable key and secret key to Vercel environment variables.

### 2. Configure Redirects

In Clerk dashboard, set:
- **Sign-in URL:** `/sign-in`
- **Sign-up URL:** `/sign-up`
- **After sign-in URL:** `/`
- **After sign-up URL:** `/`

### 3. Webhooks (Optional)

If you need Clerk to notify the app of user events, configure a webhook endpoint in Clerk dashboard pointing to your app.

## Supabase Setup

### 1. Create Project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Note the project URL, anon key, and service role key.

### 2. Apply Schema

Run the schema from `supabase-schema.sql` in the Supabase SQL Editor. This creates:

- `leads` table with assessment data columns
- `assessment_results` table
- `partial_completions` table with resume tokens
- `assessment_metadata` table for counters
- `admin_activity_log` table
- `get_weekly_stats` RPC function

### 3. Storage

1. In Supabase dashboard, go to Storage.
2. Create a bucket named `reports` with public access enabled.
3. This bucket stores generated HTML assessment reports.

### 4. Row Level Security

Configure RLS policies as needed. The application uses the service role key for server-side operations, which bypasses RLS. If you enable RLS, ensure the service role key retains full access.

## Resend Setup

### 1. Domain Verification

1. Go to [resend.com](https://resend.com) and add your sending domain.
2. Add the required DNS records (SPF, DKIM, DMARC).
3. Wait for verification (usually a few minutes).

### 2. API Key

1. Generate an API key in the Resend dashboard.
2. Add it as `RESEND_API_KEY` in Vercel.

### 3. Verify Email Delivery

After deploying, visit `/api/test-email` to verify the email pipeline is working. This sends a test email and returns diagnostics.

## Post-Deployment Verification

After deploying, verify these components:

1. **Homepage loads** at your domain.
2. **Clerk auth works**: Try signing in with Google OAuth.
3. **Assessment flow**: Complete a test assessment and verify:
   - Results display correctly
   - Lead appears in Supabase `leads` table
   - Day 0 email is received
   - Owner notification is received
4. **Admin dashboard**: Access `/admin` with the configured password and verify leads are visible.
5. **Email pipeline**: Hit `/api/test-email` and check for successful delivery.
6. **Cron jobs**: Check Vercel dashboard > Cron Jobs to verify they are registered and running.

## Monitoring

- **Vercel**: Function logs, deployment status, analytics
- **Supabase**: Database health, storage usage
- **Resend**: Email delivery logs, bounce rates
- **Clerk**: Authentication events, user management

## Rollback

Vercel maintains deployment history. To roll back:

1. Go to Vercel project > Deployments.
2. Find the last known good deployment.
3. Click the three-dot menu and select "Promote to Production."
