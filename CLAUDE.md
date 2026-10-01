# kuldev.pl

Company website and portfolio of Dariusz Kulig (kuldev). Showcases projects
with case studies, stack, screenshots and links to live demos.

## Language

- Always reply to the user in Polish.
- Plans (plan mode, implementation plans, proposals for review) must be written
  in Polish. Keep code identifiers, file paths, commands and commit messages
  inside the plan in English.
- Code, comments, commit messages and repository docs: English.

## Architecture

Monorepo, two independent apps:

- `apps/api` — Laravel: REST API (JSON) + admin panel. Source of truth for content.
- `apps/web` — Next.js (App Router, TypeScript, Tailwind): public website.
  Fetches data from the API server-side (Server Components). The browser never
  calls the API directly.

## Commands

- Start services (required for API tests): `docker compose up -d`
- API QA (must pass): `cd apps/api && composer qa`
- API autofix: `cd apps/api && composer fix`
- API tests only: `cd apps/api && vendor/bin/pest`
- Web dev: `cd apps/web && pnpm dev`

## Rules

- If the database connection fails, ask the user to start Docker. Never change database config or switch to SQLite to make tests pass.
- Every change in behavior comes with a test. No test = not done.
- Mobile-first: every UI change must work at 375px width.
- Never read, print or commit secrets (`.env` files).
- Keep changes small and focused; one concern per commit.
- Conventional Commits with scope: `feat(api): ...`, `fix(web): ...`, `test(api): ...`.
- Do not add new dependencies without asking first.

## Definition of done

1. Tests added/updated and passing.
2. `composer qa` green (for API changes).
3. Short summary for the user: what changed and why.
