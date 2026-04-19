# API Reference

All API routes are implemented as Next.js Route Handlers under `src/app/api/`.

**Base URL:** `https://jmcbtech.com/api` (production) or `http://localhost:3000/api` (development)

---

## Lead Capture

### POST /api/leads

Capture a new lead with assessment data. Updates existing lead if email already exists.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Contact email (validated format) |
| `firstName` | string | Yes | First name |
| `lastName` | string | Yes | Last name |
| `organization` | string | No | Company name |
| `role` | string | No | Job role |
| `companySize` | string | No | Company size bracket |
| `phone` | string | No | Phone number |
| `score` | number | No | Assessment score |
| `band` | string | No | Score band (`early`, `developing`, `advanced`) |
| `answers` | object | No | Assessment question responses |
| `dimensions` | array | No | Dimension score breakdowns |

**Response (200):**

```json
{
  "success": true,
  "lead": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Smith"
  },
  "assessmentId": "uuid"
}
```

**Errors:** `400` Missing required fields or invalid email, `500` Database error

### GET /api/leads

List leads with optional filtering.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by lead status |
| `limit` | number | Max results (default: 50) |

**Response (200):**

```json
{
  "leads": [ ... ]
}
```

---

## Assessment Pipeline

### POST /api/assessment/submit

Full autonomous assessment pipeline. Scores the lead, saves to Supabase, sends emails, fires webhooks, and returns results. This is the primary assessment endpoint.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Contact email |
| `firstName` | string | No | First name |
| `lastName` | string | No | Last name |
| `organization` | string | No | Company name |
| `role` | string | Yes | Job role |
| `companySize` | string | Yes | Size bracket (e.g., `11-50`, `51-200`) |
| `answers` | object | Yes | Question ID to score mapping |
| `utmSource` | string | No | UTM source parameter |
| `utmMedium` | string | No | UTM medium parameter |
| `utmCampaign` | string | No | UTM campaign parameter |

**Response (200):**

```json
{
  "success": true,
  "leadId": "uuid",
  "overallScore": 72,
  "dimensionScores": {
    "Data Foundation": 3,
    "Strategic Alignment": 4,
    "Governance": 2
  },
  "weakestDimension": "Governance",
  "strongestDimension": "Strategic Alignment",
  "leadScore": "hot",
  "reportBranding": { "title": "...", "subtitle": "..." },
  "priorityActions": ["..."],
  "serviceRecommendations": [
    {
      "dimension": "Governance",
      "service": "AI Governance Framework",
      "description": "...",
      "deliverable": "..."
    }
  ],
  "benchmarks": { ... },
  "emailsSent": { "day0": true, "notification": true }
}
```

**Errors:** `400` Missing required fields or invalid JSON

**Side Effects:**
- Creates/updates lead in Supabase
- Creates assessment result record
- Marks partial completions as converted
- Sends Day 0 email to the user
- Sends notification email to the business owner
- Fires Make.com webhook (async, non-blocking)

### POST /api/assessment/report

Generate an AI-powered executive summary and personalized recommendations using the Claude API. Falls back to template-based content if the API key is not configured or the call fails.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `firstName` | string | Yes | First name |
| `lastName` | string | Yes | Last name |
| `organization` | string | Yes | Company name |
| `companySize` | string | Yes | Size bracket |
| `role` | string | Yes | Job role |
| `overallScore` | number | Yes | Score (0-100) |
| `dimensionScores` | object | Yes | Dimension to score mapping |
| `weakestDimension` | string | Yes | Lowest-scoring dimension |
| `strongestDimension` | string | Yes | Highest-scoring dimension |

**Response (200):**

```json
{
  "success": true,
  "reportData": {
    "reportTitle": "AI Readiness Assessment",
    "reportSubtitle": "...",
    "organization": "Acme Corp",
    "assessmentDate": "April 19, 2026",
    "overallScore": 72,
    "executiveSummary": "AI-generated narrative...",
    "dimensions": [
      {
        "dimension": "Governance",
        "score": 2,
        "recommendation": "Two-sentence recommendation..."
      }
    ],
    "priorityFocus": "Governance",
    "priorityActions": ["..."],
    "serviceRecommendations": [...],
    "preparedFor": "Jane Smith",
    "preparedBy": "Jermaine Barker, JMCB Technology Group"
  }
}
```

### POST /api/assessment/partial

Save partial assessment progress when a user reaches question 5. Generates a resume token for later recovery.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Contact email |
| `firstName` | string | No | First name |
| `lastName` | string | No | Last name |
| `organization` | string | No | Company name |
| `companySize` | string | No | Size bracket |
| `role` | string | No | Job role |
| `answersSoFar` | object | No | Partial answers |
| `currentQuestion` | number | No | Current question index |
| `utmSource` | string | No | UTM source |
| `utmMedium` | string | No | UTM medium |
| `utmCampaign` | string | No | UTM campaign |

**Response (200):**

```json
{
  "success": true,
  "resumeToken": "unique-token",
  "created": true
}
```

### GET /api/assessment/partial

Resume a partial assessment using a token.

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | Yes | Resume token |

**Response (200):**

```json
{
  "success": true,
  "partial": {
    "email": "user@example.com",
    "firstName": "Jane",
    "companySize": "11-50",
    "answersSoFar": { "1": 3, "2": 4 },
    "currentQuestion": 5
  }
}
```

**Errors:** `400` Token required, `404` Invalid or expired token

---

## Admin

### GET /api/admin/leads

List and filter leads. Requires `Authorization: Bearer <ADMIN_PASSWORD>` header.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `lead_score` | string | Filter by lead score |
| `status` | string | Filter by lead status |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 20) |
| `action` | string | Special actions: `weekly_stats`, `detail` |
| `id` | string | Lead ID (when `action=detail`) |

**Response (200) - List:**

```json
{
  "leads": [...],
  "total": 150,
  "page": 1,
  "totalPages": 8
}
```

**Response (200) - Weekly Stats:**

```json
{
  "stats": { ... }
}
```

**Response (200) - Detail:**

```json
{
  "lead": { ... }
}
```

### PATCH /api/admin/leads

Update lead status or add notes. Requires `Authorization: Bearer <ADMIN_PASSWORD>` header.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `leadId` | string | Yes | Lead UUID |
| `action` | string | Yes | Action to perform |
| `details` | string | No | Additional details (for `add_note`) |

**Actions:**

| Action | Effect |
|--------|--------|
| `mark_contacted` | Set status to `contacted` |
| `mark_qualified` | Set status to `qualified` |
| `mark_converted` | Set status to `converted` |
| `mark_unqualified` | Set status to `unqualified` |
| `add_note` | Add note text from `details` field |

**Response (200):** `{ "success": true }`

**Errors:** `401` Unauthorized, `400` Missing fields or invalid action

---

## Cron Jobs

These endpoints are triggered by Vercel Cron on an hourly schedule. Protected by `CRON_SECRET`.

### GET /api/cron/nurture

Send timed nurture emails based on time elapsed since assessment completion.

- **Day 1** (24-26 hours): Deep dive on weakest dimension
- **Day 3** (72-74 hours): Peer comparison and benchmarks
- **Day 7** (168-170 hours): Final follow-up with consultation CTA

**Response (200):**

```json
{
  "success": true,
  "sent": 5,
  "checked": { "day1": 3, "day3": 1, "day7": 1 },
  "timestamp": "2026-04-19T10:00:00.000Z"
}
```

### GET /api/cron/recover

Send recovery emails to users who abandoned the assessment 2-4 hours ago.

**Response (200):**

```json
{
  "success": true,
  "sent": 2,
  "checked": 3,
  "timestamp": "2026-04-19T10:00:00.000Z"
}
```

---

## Utility

### GET /api/test-email

Email pipeline diagnostics. Sends a test email and returns configuration status.

**Response (200):**

```json
{
  "diagnostics": [
    "RESEND_API_KEY: SET (re_12345...)",
    "Email send result: SENT SUCCESSFULLY"
  ],
  "timestamp": "2026-04-19T10:00:00.000Z"
}
```

### POST /api (root)

Legacy report generation endpoint. Generates an HTML assessment report, stores it in Supabase Storage, and returns the URL.

**Request Body:** Assessment data (firstName, lastName, email, organization, role, companySize, score, band, dimensions).

**Response (200):**

```json
{
  "success": true,
  "reportId": "report-1713520000000-abc123",
  "reportUrl": "https://your-project.supabase.co/storage/v1/object/public/reports/...",
  "htmlReport": "<html>...</html>"
}
```
