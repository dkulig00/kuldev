# kuldev.pl

Company website and portfolio of Dariusz Kulig (kuldev). Showcases projects
with case studies, stack, screenshots and links to live demos.

## Language

- Always reply to the user in Polish.
- Plans (plan mode, implementation plans, proposals for review) must be written
  in Polish. Keep code identifiers, file paths, commands and commit messages
  inside the plan in English.
- Code, comments, commit messages and repository docs: English.
- Plans saved to `docs/plans/` follow the same Polish-language rule above and
  use a date-prefixed filename (`YYYY-MM-DD-slug.md`). All other repository
  docs (ADRs in `docs/decisions/`, README, code comments) stay in English per
  the rule above.

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
- Web QA (must pass): `cd apps/web && pnpm qa`
- Web autofix: `cd apps/web && pnpm format`
- Web E2E tests (Playwright, not part of `qa`): `cd apps/web && pnpm test:e2e`

## Rules

- If the database connection fails, ask the user to start Docker. Never change database config or switch to SQLite to make tests pass.
- Every change in behavior comes with a test. No test = not done.
- Mobile-first: every UI change must work at 375px width.
- Never read, print or commit secrets (`.env` files).
- Keep changes small and focused; one concern per commit.
- Conventional Commits with scope: `feat(api): ...`, `fix(web): ...`. Scope is
  required when a commit touches only one app (`api` or `web`); it is optional
  for repo-wide changes (e.g. `ci:`, `docs:`) that touch shared tooling, CI
  config, or documentation outside a single app.
- Do not add new dependencies without asking first.

## Motion

Rules for animations in `apps/web` (details: `docs/decisions/0008-motion-foundation.md`):

- Only `motion` (Motion for React); no other animation or smooth-scroll libraries.
- Import `motion/*` only in `src/components/motion/`; use `m.*`, never `motion.*`.
- Respect `prefers-reduced-motion`: without motion the page must be complete.
- Animate only `transform` and `opacity`.
- Content must be visible without JavaScript; never ship a hidden state in
  server HTML. The Hero has no entrance animation.
- Sections stay Server Components; animated parts are small client components.
- Add a new primitive only together with its first real use.

## Planning

- Before the user accepts a plan for a non-trivial change, suggest running
  `/grill-plan` (skeptical review against ADRs and `checklist.md`).
- New lessons from plan reviews go into `.claude/skills/grill-plan/checklist.md`.

## Definition of done

1. Tests added/updated and passing.
2. `composer qa` green (for API changes).
3. Short summary for the user: what changed and why.
