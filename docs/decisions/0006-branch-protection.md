# 0006: Branch protection ruleset for main

Date: 2026-10-03
Status: accepted

## Context

`main` had no branch protection at all: `GET /repos/.../branches/main/protection`
returned `404 Branch not protected` and `GET /repos/.../rulesets` returned `[]`.
Anyone with write access could push directly to `main` or merge a PR with
failing CI, bypassing the `api`, `web`, and `e2e` jobs added in
`docs/plans/2026-10-02-ci-github-actions.md` and
`docs/plans/2026-10-02-e2e-playwright-tests.md`.

## Decision

Created a repository ruleset named "protect main" (`id: 24412670`) via
`POST /repos/dkulig00/kuldev/rulesets`, targeting the default branch
(`conditions.ref_name.include: ["~DEFAULT_BRANCH"]`), with `enforcement:
active` and `bypass_actors: []` (no one, including admins, can bypass it).

Rules:

- `deletion` — blocks deleting the branch.
- `non_fast_forward` — blocks force-pushes.
- `pull_request` — changes must go through a PR. `required_approving_review_count:
  0` (single-maintainer repo, no second reviewer available).
  `allowed_merge_methods: ["squash"]` — matches the squash-merge convention
  already visible in `main`'s history (each merged PR is one commit with a
  trailing `(#N)`).
- `required_status_checks` — `api`, `web`, `e2e` must pass.
  `strict_required_status_checks_policy: false` (the branch does not need to
  be up to date with `main` before merging; see
  `docs/decisions/0004-ci-no-path-filters.md` for the related reasoning
  about these job IDs staying stable with no `name:` field). Each check is
  additionally pinned with `integration_id: 15368` — the `github-actions`
  GitHub App's ID, confirmed against this repo's own check-runs
  (`GET /repos/.../commits/{sha}/check-runs`) rather than assumed. This
  stops any other app/integration with status-write access from
  satisfying a required check by posting a same-named status.

Verified:

- `GET /repos/dkulig00/kuldev/rulesets` lists the ruleset as `enforcement:
  active`.
- A direct push of an empty commit straight to `main` was rejected:
  ```
  remote: error: GH013: Repository rule violations found for refs/heads/main.
  remote: - Changes must be made through a pull request.
  remote: - 3 of 3 required status checks are expected.
  ```

## Risk if ignored

Without this ruleset, the CI jobs built in prior plans are advisory only —
a direct push or an admin merge can land on `main` with no tests run at
all, silently defeating the purpose of the `e2e` suite and `composer
qa`/`pnpm qa` gates.

## Revisit when

- A second collaborator joins: raise `required_approving_review_count`
  above `0` so merges get an actual second set of eyes, not just a
  formality.
- Any other GitHub App or service is granted status-write access to this
  repo: the `integration_id: 15368` pin stops being purely defensive and
  starts being load-bearing — confirm it still matches `github-actions`
  before relying on it.
