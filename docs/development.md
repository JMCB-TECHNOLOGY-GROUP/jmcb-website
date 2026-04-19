# Development Guide

## Prerequisites

- **Node.js 18+** and npm
- **Git** for version control
- Service accounts for: Clerk, Supabase, Resend (see [Deployment Guide](deployment.md) for setup)

## Local Setup

```bash
# Clone the repository
git clone <repository-url>
cd jmcb-website

# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Fill in all values in .env.local (see deployment.md for required variables)

# Start the development server
npm run dev
```

The app runs at `http://localhost:3000`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server with hot reload |
| `npm run build` | Production build (validates TypeScript and generates `.next/`) |
| `npm run start` | Start production server from built output |
| `npm run lint` | Run ESLint across the project |

## Project Conventions

### File Naming

- Pages and layouts: `page.tsx`, `layout.tsx` (Next.js convention)
- API routes: `route.ts` inside the appropriate path
- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`

### Known Issue: Capital L in `src/Lib/`

The `src/Lib/` directory uses a capital L, which is inconsistent with standard conventions. This is documented technical debt. When importing, use the alias:

```typescript
import { createServerClient } from "@/lib/supabase";
// Note: the @/lib alias maps to src/Lib/ in tsconfig
```

Do not create a new `src/lib/` directory. When this is eventually refactored, all imports will be updated in a single PR.

### TypeScript

- Strict mode is enabled.
- Use Next.js types for API routes (`NextRequest`, `NextResponse`).
- Database types are defined in `src/Lib/db-types.ts`.

### Styling

- Tailwind CSS for all styling. Avoid custom CSS except in `globals.css`.
- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) for responsive design.
- Framer Motion for animations and transitions.

### API Routes

- All API routes are in `src/app/api/`.
- Use `NextRequest` and `NextResponse` from `next/server`.
- Validate required fields at the top of each handler.
- Return structured JSON responses with `success` boolean or `error` message.
- Use `try/catch` with `console.error` for error logging (structured logging is a future improvement).

### Environment Variables

- `NEXT_PUBLIC_*` variables are exposed to the client bundle.
- All other variables are server-only.
- Never import `SUPABASE_SERVICE_ROLE_KEY` or `CLERK_SECRET_KEY` in client components.

## Working with Supabase

### Creating the Supabase Client

```typescript
import { createServerClient } from "@/lib/supabase";

// In API routes (server-side only)
const supabase = createServerClient();
const { data, error } = await supabase.from("leads").select("*");
```

### Schema Changes

The database schema is in `supabase-schema.sql` at the project root (also duplicated in `src/Lib/`). There are no versioned migrations yet.

To apply schema changes:
1. Update `supabase-schema.sql`.
2. Run the SQL in the Supabase SQL Editor.
3. Update `src/Lib/db-types.ts` if types changed.

### Testing Database Queries

Use the Supabase dashboard SQL Editor to test queries before implementing them in code.

## Working with Clerk

Clerk is configured in `src/app/layout.tsx` with `ClerkProvider`. Authentication state is available throughout the app.

For protected pages, use Clerk's middleware or component-level checks. The admin API routes use a simpler password-based auth (not Clerk) for operational simplicity.

## Working with Resend

Email templates are in `src/Lib/email-renderer.ts`. Each function returns `{ subject, html }`.

To test email delivery locally:
1. Ensure `RESEND_API_KEY` is set in `.env.local`.
2. Start the dev server.
3. Visit `http://localhost:3000/api/test-email` in your browser.
4. Check the JSON response for diagnostics.

## Working with the Claude API

The assessment report endpoint (`/api/assessment/report`) uses the Claude API for AI-generated summaries. It calls the API directly via `fetch` (no SDK dependency).

- If `ANTHROPIC_API_KEY` is not set, the endpoint falls back to template-based content.
- The model used is `claude-sonnet-4-5-20250929`.
- Two API calls are made per report: one for the executive summary, one for dimension recommendations.

## Common Development Tasks

### Adding a New Page

1. Create a directory under `src/app/` with the route name.
2. Add `page.tsx` inside it.
3. Add navigation links in `Header.tsx` if needed.

### Adding a New API Route

1. Create the directory structure under `src/app/api/`.
2. Add `route.ts` with exported `GET`, `POST`, `PATCH`, or `DELETE` functions.
3. Add input validation and error handling.
4. Document the endpoint in `docs/api-reference.md`.

### Adding a New Email Template

1. Add a new function in `src/Lib/email-renderer.ts` following the existing pattern.
2. Return `{ subject: string, html: string }`.
3. Use the `sendEmail` helper from `src/Lib/send-email.ts` to dispatch.

### Modifying the Assessment

Assessment questions, scoring logic, branding, and dimension mappings are all defined in `src/Lib/assessment-content.ts`. Changes here affect the entire assessment pipeline.

## Debugging

### API Route Errors

Check Vercel function logs (production) or terminal output (development). All API routes use `console.error` for error logging.

### Email Not Sending

1. Check `/api/test-email` diagnostics.
2. Verify `RESEND_API_KEY` is set and valid.
3. Check Resend dashboard for delivery logs.
4. Verify domain DNS records are correct.

### Supabase Connection Issues

1. Verify `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct.
2. Check Supabase dashboard for project status.
3. Verify the table schema matches expected columns.
