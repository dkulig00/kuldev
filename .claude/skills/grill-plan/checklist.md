# Plan review checklist

Go through every group. Report an item only when the plan actually has the
problem and you can name a concrete scenario where it hurts. Add new lessons
from reviews here (short item, why, example from this repo).

## 1. Compliance

- **Contradicts an ADR or CLAUDE.md.**
  Why: ADRs record failure modes that were already paid for once.
  Example: adding `paths`/`paths-ignore` to CI triggers breaks ADR 0004 - a
  docs-only PR leaves the required `api`/`web` checks pending forever.
- **Changes a decision without a new ADR.**
  Why: the next session reads the old ADR and reverts the change.
  Example: generalizing the off-screen rule for motion primitives required
  updating ADR 0008, not just the code of `ScrollTransform`.

## 2. Blast radius

- **Global change where a local one is enough.**
  Why: global defaults silently change behavior for future callers.
  Example: `getRouteKeyName()` returning `slug` on `Project` would make every
  route bound to `{project}` use slugs - including a future admin panel that
  needs ids and drafts. A scoped query in `ProjectController` stays local.

## 3. Determinism

- **Ambiguous ordering.**
  Why: equal sort keys return rows in arbitrary order; pagination and snapshot
  tests flake.
  Example: `ProjectController` sorts by `sort_order`, `published_at` and then
  `id` as the tiebreaker.
- **Time or network dependency in the build or tests.**
  Why: the same commit passes one day and fails the next.
  Example: `next/font/google` fetched fonts at build time and broke builds
  intermittently (ADR 0005). Also: `now()` without a frozen clock in tests.

## 4. Environments

- **Dev code or demo data leaking to production.**
  Why: whatever is reachable in the prod build is shipped to visitors.
  Example: a static import of the dev feedback overlay left its code in the
  production bundle even behind a `NODE_ENV` check; `ProjectSeeder` runs from
  `DatabaseSeeder` only under `app()->environment('local')`.
- **Verifying the HTML instead of the bundle.**
  Why: code can be absent from the rendered page but present in `.next/static`.
  Example: CI greps `.next/static` for the overlay marker; the E2E HTML check
  missed it.

## 5. Tests

- **Test that cannot fail (no positive control).**
  Why: a check that passes when the feature is broken proves nothing.
  Example: on a tall viewport the Contact section is already visible, so a
  "content is visible" test passes without testing `Reveal`; the spec uses
  375x400 and asserts the section starts off-screen first.
- **Checking the end state instead of the behavior.**
  Why: a flash of hidden content ends in the same final state.
  Example: `motion-full.spec.ts` samples minimum opacity per animation frame
  for 1.5 s on `/pl#kontakt` instead of checking opacity once at the end.
- **Safeguard without a test.**
  Why: unprotected guards get removed in refactors.
  Example: the 415/403/413 responses of `/api/dev-feedback`, the ESLint rule
  blocking `motion` imports (plus a test that the allowed import still passes).
- **Missing cleanup between component tests.**
  Why: leftover DOM from one test makes queries in the next one match the
  wrong element.
  Example: Vitest runs without `globals`, so Testing Library does not clean up
  automatically; component tests need `afterEach(cleanup)`.
- **Tests in the wrong environment.**
  Why: dev and prod builds behave differently.
  Example: the dev-only save spec is excluded from the prod E2E run
  (`testIgnore`) and runs with `playwright.dev.config.ts`; prod-absence runs
  against a production build with `CI=1`.

## 6. Security

- **Untrusted data reaching an AI (prompt injection).**
  Why: the assistant has repo access; text it reads can carry instructions.
  Example: `.ai-feedback/` comments are untrusted (ADR 0007, `apply-feedback`).
- **CSRF on dev endpoints.**
  Why: any page open in the same browser can post to localhost.
  Example: `/api/dev-feedback` requires JSON Content-Type and Origin == Host.
- **Path traversal.**
  Why: user input in a file path writes outside the target directory.
  Example: whitelisted slug plus `isInsideDir` before writing feedback files.
- **Secrets.** Enforced automatically (`deny` rules for `.env` in
  `.claude/settings.json`); only check that the plan does not work around it
  and puts new config in `.env.example`.
- **CI permissions and pinned actions.**
  Why: broad `GITHUB_TOKEN` scopes and mutable tags widen supply-chain risk.
  Example: set minimal `permissions:`; a pinned SHA must be the commit SHA,
  not the annotated tag object SHA - verify with the API, do not assume.

## 7. Accessibility and mobile

- **375 px (iPhone SE).** Every UI change; E2E runs an iPhone SE project and
  `layout-overflow.spec.ts` guards horizontal scroll.
- **WCAG AA in both themes.** ADR 0002: light `ink` on amber/cyan is 1.56:1 -
  disallowed. Check every new color pair, in every theme the plan touches.
- **Identical link texts with different targets.** General rule (no incident
  in this repo yet): screen readers list links out of context, so repeated
  texts need distinct accessible names.
- **`tabindex` on non-interactive elements.** General rule (no incident in
  this repo yet): adds useless tab stops; only interactive elements or scroll
  containers that need it.
- **`prefers-reduced-motion`.** Without motion the page is complete (ADR 0008).
- **Content without JavaScript.** Server HTML never contains a hidden state.

## 8. Animation

- **State changes only off-screen.** A primitive may change an element only
  while it is fully below the viewport (ADR 0008).
- **Entry via `#hash`.** `/pl#kontakt` must not hide or flash the target, its
  ancestors or descendants.
- **Slow or failed JS chunk.** Hiding and revealing must live in the same lazy
  chunk, so a failed chunk leaves content visible.

## 9. Truth in the UI

- **Visual elements implying false information.**
  Why: the site sells credibility; a wrong implication is a lie.
  Example: services shown as fader channels at different levels read as a
  ranking or skill rating; levels must be equal or explicitly meaningful.
- **Invented numbers, clients, testimonials.** No placeholder metrics or
  reviews that could ship. Copy and numbers are user decisions.

## 10. Name stability

- **CI job names as required checks.** `api`, `web`, `e2e` are required by the
  branch ruleset (ADR 0006); renaming a job or adding `name:` blocks merges.
- **Translation keys.** Typed keys (`global.d.ts`) - renames must cover
  `pl.json` and `en.json` together.
- **Public API contracts.** `/api/v1/...` fields consumed by `apps/web`;
  renames need a version or a coordinated change in both apps.

## 11. Scope

- **Code without a use.** A new primitive ships only with its first real use
  (ADR 0008: `ScrollTransform` waited for the services section).
- **New dependencies without approval.** CLAUDE.md: ask first.
- **Scope creep.** Refactors or "while we are here" changes outside the goal
  go to a separate plan.

## 12. Visual work

- **Will the AI see its result?** For UI changes the plan must include
  screenshots (375 px and desktop, every theme in use) reviewed before handing
  over - tests passing does not mean it looks right.

## 13. Process

- Enforced by CLAUDE.md and the `main` ruleset (ADR 0006); only check that
  the plan does not work around it: plan in `docs/plans/YYYY-MM-DD-slug.md`,
  one concern per commit, PR instead of a push to `main`, tests for every
  behavior change.
