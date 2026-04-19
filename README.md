# JMCB Technology Group Website

The corporate website for **JMCB Technology Group**, featuring an AI Readiness Assessment tool, automated lead capture and nurture pipeline, service pages, and an admin dashboard. Built with Next.js 14 and deployed on Vercel.

**Live:** [jmcbtech.com](https://jmcbtech.com)

---

## Features

### AI Readiness Assessment
- Interactive questionnaire tailored by company size (1-10, 11-50, 51-200, 201-1000, 1000+)
- Real-time scoring across multiple dimensions (Data Foundation, Strategic Alignment, Governance, etc.)
- AI-generated executive summaries and personalized recommendations via the Claude API
- Branded HTML reports stored in Supabase Storage with shareable URLs
- Partial completion recovery with resume tokens for users who abandon mid-assessment

### Lead Capture and Nurture
- Automatic lead scoring based on role, company size, and assessment answers
- Supabase-backed lead database with duplicate detection
- Automated multi-day email nurture sequence (Day 0, 1, 3, 7) via Resend
- Partial completion recovery emails sent 2 hours after abandonment
- Make.com webhook integration for CRM sync
- Owner notification emails on every new assessment

### Admin Dashboard
- Password-protected lead management with filtering by score and status
- Lead detail views with full assessment data
- Status workflow: new, contacted, qualified, converted, unqualified
- Weekly stats via Supabase RPC
- Activity logging for all admin actions

### Service Pages
- Healthcare technology solutions
- Enterprise AI consulting
- General services overview
- Product pages

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Authentication | Clerk (Google OAuth + email) |
| Database | Supabase (PostgreSQL) |
| Email | Resend |
| AI | Anthropic Claude API (report generation) |
| Webhooks | Make.com |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Analytics | Vercel Speed Insights |
| Hosting | Vercel |

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Clerk account (authentication)
- Supabase project (database and storage)
- Resend account (email delivery)
- Anthropic API key (optional, for AI report generation)

### Installation

```bash
git clone <repository-url>
cd jmcb-website
npm install
```

### Environment Setup

Copy `.env.local.example` to `.env.local` and fill in the values:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Email (Resend)
RESEND_API_KEY=re_...
RESEND_FROM=Jermaine Barker <jermaine@info.jmcbtech.com>

# Anthropic (optional - enables AI executive summaries)
ANTHROPIC_API_KEY=sk-ant-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin
ADMIN_PASSWORD=your-admin-password

# Cron (Vercel cron jobs)
CRON_SECRET=your-cron-secret

# External integrations
MAKE_WEBHOOK_URL=https://hook.us2.make.com/...
NEXT_PUBLIC_CALENDLY_LINK=https://calendly.com/...
JERMAINE_EMAIL=jermaine@jmcbtech.com
```

### Development

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run lint         # Run ESLint
```

---

## Project Structure

```
src/
  app/
    page.tsx                    # Homepage
    layout.tsx                  # Root layout (Clerk provider, analytics)
    not-found.tsx               # 404 page
    globals.css                 # Global styles

    admin/                      # Admin dashboard pages
    assessment/                 # AI readiness assessment UI
    associations/               # Industry associations page
    enterprise/                 # Enterprise services page
    healthcare/                 # Healthcare services page
    leadership/                 # Leadership team page
    products/                   # Product pages
    report/                     # Assessment report viewer
    services/                   # General services page

    api/
      leads/route.ts            # Lead capture (POST) and listing (GET)
      assessment/
        submit/route.ts         # Full assessment pipeline (score, save, email, webhook)
        report/route.ts         # AI-generated executive summary via Claude
        partial/route.ts        # Partial completion save/resume
      admin/leads/route.ts      # Admin lead management (list, filter, status update)
      cron/
        nurture/route.ts        # Nurture email sequence (Day 1, 3, 7)
        recover/route.ts        # Partial completion recovery emails
      test-email/route.ts       # Email pipeline diagnostics
      route.ts                  # Root API / report generation with HTML storage

  Lib/                          # Utilities (NOTE: capital L - known tech debt)
    supabase.ts                 # Supabase client factory
    send-email.ts               # Resend email wrapper
    email-renderer.ts           # HTML email templates
    lead-scoring.ts             # Lead quality scoring logic
    assessment-content.ts       # Questions, branding, dimension maps
    db-types.ts                 # Database type definitions

  components/
    Header.tsx                  # Site header / navigation
    Footer.tsx                  # Site footer
    TrustBar.tsx                # Trust indicators bar
```

---

## Architecture

The application follows Next.js 14 App Router conventions with server-side API routes and client-side React components.

**Assessment Pipeline Flow:**

```
User completes assessment
  -> POST /api/assessment/submit
    -> Calculate dimension scores
    -> Score lead quality
    -> Save to Supabase (leads + assessment_results)
    -> Send Day 0 email to user (Resend)
    -> Send notification to owner (Resend)
    -> Fire Make.com webhook
    -> Return results to client

Vercel Cron (hourly)
  -> GET /api/cron/nurture
    -> Send Day 1/3/7 emails based on time since completion
  -> GET /api/cron/recover
    -> Send recovery emails to abandoned partial completions
```

**Data Flow:**

```
Clerk (Auth) --> Next.js App Router --> Supabase (PostgreSQL)
                      |                       |
                      +--> Resend (Email)      +--> Supabase Storage (Reports)
                      +--> Claude API (AI)
                      +--> Make.com (Webhook)
```

See [docs/architecture.md](docs/architecture.md) for the full architecture documentation.

---

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/architecture.md) | System architecture, data models, and pipeline flows |
| [API Reference](docs/api-reference.md) | Complete API endpoint documentation |
| [Deployment](docs/deployment.md) | Vercel, Clerk, Supabase, and Resend setup guide |
| [Development](docs/development.md) | Local development guide and project conventions |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

---

## License

MIT License. Copyright (c) 2026 JMCB Technology Group. See [LICENSE](LICENSE) for details.
