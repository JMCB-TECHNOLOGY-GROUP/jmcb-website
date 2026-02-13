# JMCB Assessment Overhaul: Integration Guide
## Tailored for github.com/JMCB-TECHNOLOGY-GROUP/jmcb-website

---

## What This Changes

| Existing File | Action |
|---|---|
| `src/app/assessment/page.tsx` (975 lines) | **REPLACED** with new 8-stage assessment flow |
| `src/app/admin/page.tsx` (306 lines) | **REPLACED** - drops broken Clerk auth, adds password auth + lead scoring UI |
| `src/app/api/leads/route.ts` | **KEEP** - still works for backward compatibility |
| `src/app/api/route.ts` | **KEEP** - existing HTML report generation still works |
| `src/lib/supabase.ts` | **KEEP** - all new routes import from this file |
| `src/lib/supabase-schema.sql` | **REPLACED** with expanded migration |

| New File | Purpose |
|---|---|
| `src/lib/assessment-content.ts` | Questions, benchmarks, ASCEND mapping, helpers |
| `src/lib/email-templates.ts` | 3 nurture emails + partial completion email |
| `src/lib/lead-scoring.ts` | Hot/Warm/Cold classification algorithm |
| `src/app/api/assessment/submit/route.ts` | Full submission endpoint (replaces calling /api/leads + /api directly) |
| `src/app/api/assessment/partial/route.ts` | Mid-assessment email capture + resume |
| `src/app/api/assessment/report/route.ts` | Claude API-powered report content |
| `src/app/api/admin/leads/route.ts` | Admin dashboard API with filters + actions |

---

## Step-by-Step Integration

### 1. Install new dependency

```bash
cd jmcb-website
npm install framer-motion
```

Optional (only needed if you want AI-generated reports):
```bash
npm install @anthropic-ai/sdk
```

### 2. Run the Supabase migration

Open Supabase Dashboard -> SQL Editor -> paste and run `src/lib/supabase-schema.sql`

This migration is safe:
- Creates the `leads` table IF it doesn't exist (your code references it but the original schema SQL only has `users` + `assessment_results`)
- Adds new columns to `leads` using `ADD COLUMN IF NOT EXISTS`
- Creates `partial_completions`, `assessment_metadata`, `admin_activity_log` tables
- Adds a `get_weekly_stats()` function and `lead_summary` view
- All existing data is preserved

### 3. Add environment variables

Add to `.env.local` (you already have the Supabase and Clerk vars):

```env
# New for assessment overhaul
MAKE_WEBHOOK_URL=https://hook.us2.make.com/wsneore7j9b7sy6smxpbs0al2mf8ef75
MAKE_NURTURE_WEBHOOK_URL=
MAKE_NOTIFICATION_WEBHOOK_URL=
ADMIN_PASSWORD=pick-something-strong-here

# Optional: enables AI-generated executive summaries in PDF reports
ANTHROPIC_API_KEY=

# Optional: override calendly link (defaults to your existing one)
NEXT_PUBLIC_CALENDLY_LINK=https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation
```

Notes:
- `MAKE_WEBHOOK_URL` defaults to your existing hardcoded webhook URL if env var is missing
- `MAKE_NURTURE_WEBHOOK_URL` and `MAKE_NOTIFICATION_WEBHOOK_URL` are optional. If empty, those features are silently skipped
- `ANTHROPIC_API_KEY` is optional. Without it, the report endpoint uses template-based fallbacks

Add the same vars in Vercel Dashboard -> Settings -> Environment Variables for production.

### 4. Copy the new files

From this package into your repo:

```
src/lib/assessment-content.ts     -> src/lib/assessment-content.ts    (NEW)
src/lib/email-templates.ts        -> src/lib/email-templates.ts       (NEW)
src/lib/lead-scoring.ts           -> src/lib/lead-scoring.ts          (NEW)
src/lib/supabase-schema.sql       -> src/lib/supabase-schema.sql      (REPLACE)

src/app/assessment/page.tsx        -> src/app/assessment/page.tsx      (REPLACE)
src/app/admin/page.tsx             -> src/app/admin/page.tsx           (REPLACE)

src/app/api/assessment/submit/route.ts   -> (NEW directory + file)
src/app/api/assessment/partial/route.ts  -> (NEW directory + file)
src/app/api/assessment/report/route.ts   -> (NEW directory + file)
src/app/api/admin/leads/route.ts         -> (NEW directory + file)
```

Your existing files that are NOT touched:
- `src/app/api/route.ts` (HTML report generation - still works)
- `src/app/api/leads/route.ts` (existing lead capture - still works)
- `src/lib/supabase.ts` (shared client - all new routes use this)
- `src/components/*` (Header, Footer, etc. - untouched)
- All other pages (services, healthcare, enterprise, associations)

### 5. Test locally

```bash
npm run dev
```

Test the full flow:
1. Go to `localhost:3000/assessment`
2. Walk through as a "hot" lead: C-Suite, 200+ employees, score 1-2 on everything
3. Enter email at the halfway checkpoint
4. Complete all 10 questions
5. Verify the analyzing animation plays
6. Check results page: gauge, dimensions, priority action, CTAs
7. Check Supabase: `leads` table should have new row with `lead_score`, `overall_score_v2`, `dimension_scores_v2`, `weakest_dimension` columns populated
8. Go to `localhost:3000/admin`, log in with your ADMIN_PASSWORD
9. Verify you see the new lead with Hot/Warm/Cold scoring

### 6. Update Make.com

Your existing Make.com scenario receives webhook data. The new submit endpoint sends a RICHER payload to the same webhook URL. Your scenario will still fire, but to use the new data, update your scenario to handle these new fields:

```
New fields in webhook payload:
- overallScore (0-100 scale, in addition to existing 0-50 "score")
- dimensionScores (object: {"Data Foundation": 3, "AI Strategy": 2, ...})
- weakestDimension (string)
- strongestDimension (string)
- leadScore ("hot" | "warm" | "cold")
- reportBranding ({title, subtitle, focus})
- priorityActions (array of 3 strings)
- serviceRecommendations (array of gap-to-service mappings)
```

The existing `score`, `band`, `dimensions` fields are still sent for backward compatibility.

### 7. Set up new Make.com scenarios (when ready)

**Nurture Sequence** (set MAKE_NURTURE_WEBHOOK_URL):
- Day 1: Send results email using template from email-templates.ts
- Day 3: Send dimension deep-dive email
- Day 7: Send CTA email with limited-time offer

**Hot Lead Alert** (set MAKE_NOTIFICATION_WEBHOOK_URL):
- Fires immediately when someone scores "hot"
- Send yourself an SMS/email/Slack with their details

These are optional. The assessment works without them.

### 8. Deploy

```bash
git add -A
git commit -m "Assessment overhaul: lead scoring, mid-capture, dark theme, admin dashboard"
git push origin main
```

Vercel will auto-deploy. Make sure your production env vars are set.

---

## Key Differences from Current Assessment

| Feature | Before | After |
|---|---|---|
| Theme | White, uses Header/Footer | Dark standalone experience |
| Questions | 10 fixed questions, 1-5 scale radio | 10 adaptive (14 total, swaps by company size) |
| Score | 0-50, three bands | 0-100, five tiers + dimension breakdown |
| Lead capture | After all questions | At question 5 (halfway) + end |
| Lead scoring | None | Hot/Warm/Cold with immediate alerts |
| Make.com | Called from frontend with mode:no-cors | Called from server-side API route |
| Results | Basic score + band + blockers | Gauge, benchmarks, priority action, services, share |
| Admin | Clerk auth (broken) | Password auth, lead scoring, weekly stats |
| PDF report | Static HTML template | AI-generated executive summary (optional) |
| Partial saves | None | Saved at Q5 with resume token |

---

## Database Column Mapping

Your existing `leads` table columns are all preserved. New columns are added alongside:

| Existing Column | Still Used | New V2 Column |
|---|---|---|
| `assessment_score` (0-50) | Yes | `overall_score_v2` (0-100) |
| `assessment_band` | Yes | `lead_score` (hot/warm/cold) |
| `assessment_answers` | Yes (same data) | - |
| `assessment_dimensions` | Yes (legacy format) | `dimension_scores_v2` (new format) |
| `status` | Yes (same values) | - |
| `organization` | Yes | - |
| - | - | `weakest_dimension` (new) |
| - | - | `strongest_dimension` (new) |
| - | - | `lead_score_reason` (new) |
| - | - | `utm_source/medium/campaign` (new) |

Both old and new data is written on every submission so existing reports/queries still work.

---

## Reverting

If you need to go back:
- `git revert` the commit
- The Supabase migration only added columns and tables, never dropped anything
- Your old assessment page and admin page are in git history
