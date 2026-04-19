# Contributing to the JMCB Technology Group Website

Thank you for your interest in contributing. This document provides guidelines for contributing to the project.

## Getting Started

1. Clone the repository and follow the setup instructions in [docs/development.md](docs/development.md).
2. Create a branch from `main` with a descriptive name:
   - `feat/add-testimonials-section`
   - `fix/assessment-score-calculation`
   - `docs/update-api-reference`

## Development Workflow

1. **Make changes** following the project conventions in [docs/development.md](docs/development.md).
2. **Test locally**: Run `npm run dev` and verify your changes work.
3. **Build check**: Run `npm run build` to ensure no TypeScript or build errors.
4. **Lint**: Run `npm run lint` to check for code style issues.
5. **Open a pull request** against `main`.

## Coding Standards

### TypeScript

- Strict mode is enabled. Avoid `any` types without justification.
- Use Next.js conventions for pages (`page.tsx`), layouts (`layout.tsx`), and API routes (`route.ts`).
- Import from `@/lib/` for utility modules (note: maps to `src/Lib/` due to known capitalization issue).

### Styling

- Use Tailwind CSS utility classes. Avoid custom CSS.
- Follow the existing responsive breakpoint patterns.
- Use Framer Motion for animations, consistent with existing components.

### API Routes

- Validate all inputs at the top of the handler.
- Return consistent response shapes: `{ success: true, ... }` or `{ error: "message" }`.
- Wrap handlers in try/catch with `console.error` for logging.
- Document new endpoints in [docs/api-reference.md](docs/api-reference.md).

### Commit Messages

Use conventional commit format:

```
feat: add testimonials carousel to homepage
fix: correct dimension score rounding in assessment
docs: update deployment guide for new env vars
refactor: extract email template helpers
```

## Security

- Never commit `.env.local` or any file containing API keys.
- `SUPABASE_SERVICE_ROLE_KEY` and `CLERK_SECRET_KEY` must only be used in server-side code (API routes, server components). Never import them in client components.
- Validate email addresses on all public endpoints.
- Be cautious with any changes to the admin routes -- they control lead data access.

## Pull Request Checklist

Before submitting a PR, verify:

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] New environment variables (if any) are documented
- [ ] API changes are reflected in `docs/api-reference.md`
- [ ] No secrets or API keys in the diff
- [ ] Tested manually in the development environment

## Questions?

Open an issue or reach out to the maintainers before starting work on large changes.
