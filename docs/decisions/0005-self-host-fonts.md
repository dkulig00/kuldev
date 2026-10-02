# 0005: Self-host fonts instead of next/font/google

Date: 2026-10-02
Status: accepted

## Context

`apps/web` used `next/font/google` for Big Shoulders, IBM Plex Sans and
IBM Plex Mono. `next/font/google` fetches font files from Google at build
time. Turbopack (the default bundler in Next.js 16) fails to parse some of
the URL shapes Google's font CSS can return, causing `pnpm build` to fail
with "next/font/google queries have exactly one entry" (open upstream bug,
vercel/next.js#99114). The failure is intermittent: it depends on what
Google's font service happens to return at build time, not on any change
to this repo's code, so the same commit can build successfully one time
and fail the next.

## Decision

Vendor the font files instead of fetching them at build time. Weights
actually used in the UI (Big Shoulders 600/700, IBM Plex Sans 400/500/600,
IBM Plex Mono 400/500, all `normal` style) are subset to Latin + Latin
Extended-A (covers Polish diacritics) and committed as `.woff2` files under
`apps/web/src/fonts/`, alongside each family's `OFL.txt` license (both
families are SIL Open Font License, which permits bundling provided the
license file is included). `apps/web/src/fonts.ts` loads them via
`next/font/local`, keeping the same exported CSS variable names
(`--font-big-shoulders`, `--font-plex-sans`, `--font-plex-mono`) so no
other file needs to change. A `no-restricted-imports` ESLint rule blocks
new `next/font/google` imports and points here.

Google serves `latin` (`U+0000-00FF`) and `latin-ext` (`U+0100-...`) as
separate files selected via CSS `unicode-range`; `next/font/local` has no
per-`src`-entry `unicode-range` support, so a single vendored file per
weight must already contain the merged glyph set. The files here were
produced by fetching the legacy (no `unicode-range` support) single-file
TTF per weight from Google's CSS endpoint, then subsetting it with
`fonttools pyftsubset` to the combined Latin + Latin Extended-A range and
converting to `woff2`.

## Risk if ignored

The build keeps failing non-deterministically in CI and in production
deploys, unrelated to any actual code change in a given commit — the worst
kind of flake, since it erodes trust in CI results.

## Revisit when

The upstream Turbopack/Next.js bug (vercel/next.js#99114) is fixed in a
released version this repo upgrades to. Even then, building without a
network dependency on Google's font service is a benefit worth keeping on
its own merits, so revisiting is about re-evaluating the tradeoff, not an
automatic revert.
