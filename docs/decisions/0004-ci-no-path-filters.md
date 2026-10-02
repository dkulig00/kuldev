# 0004: CI runs on every push/PR without path filters

Date: 2026-10-02
Status: accepted

## Context

`.github/workflows/ci.yml` triggers the `api` and `web` jobs on every
`pull_request` and every push to `main`, with no `paths`/`paths-ignore`
filter. A documentation-only or editor-config-only commit still runs the
full suite for both apps (container startup, install, qa, build).

## Decision

Do not add path filters to the CI triggers; both jobs always run.

## Risk if ignored

If `api`/`web` become required status checks in branch protection and a
later change adds `paths`/`paths-ignore`, GitHub does not mark a skipped
required check as passing — a PR that only touches a filtered-out path
(e.g. `docs/**`) would show the required check stuck in "pending" forever
and could never be merged without a workaround (e.g. an always-run fan-in
job). The wasted CI minutes on doc-only commits are an accepted, smaller
cost than that failure mode.

## Revisit when

The repo grows enough apps/packages that unfiltered CI cost becomes
significant, and a fan-in/always-run status job pattern is introduced
alongside any path filter to keep required checks green on filtered-out
paths.
