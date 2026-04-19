# Changelog

All notable changes to the JMCB Technology Group website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-04-19

### Added

- **AI Readiness Assessment** with interactive questionnaire tailored by company size, real-time scoring across multiple dimensions, and branded HTML report generation.
- **Claude API integration** for AI-generated executive summaries and personalized dimension recommendations in assessment reports.
- **Lead capture pipeline** with duplicate detection, lead quality scoring, and Supabase-backed storage.
- **Automated email nurture sequence** (Day 0, 1, 3, 7) via Resend, triggered by Vercel cron jobs.
- **Partial completion recovery**: saves progress at question 5 with resume tokens and sends recovery emails 2 hours after abandonment.
- **Admin dashboard** with password-protected lead management, filtering, status workflow, weekly stats, and activity logging.
- **Make.com webhook integration** for external CRM sync on new assessment submissions.
- **Service pages**: Healthcare technology, Enterprise AI consulting, General services, and Products.
- **Clerk authentication** with Google OAuth and email sign-in.
- **Responsive design** with Tailwind CSS and Framer Motion animations.
- **Email diagnostics endpoint** (`/api/test-email`) for verifying the email pipeline.
- **Vercel Speed Insights** integration for performance monitoring.
