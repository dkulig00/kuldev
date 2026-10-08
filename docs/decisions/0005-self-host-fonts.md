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

### Update 2026-10-08: Archivo replaces Big Shoulders and IBM Plex Sans

The workflow direction (ADR 0009) uses Archivo for headings and body text
and keeps IBM Plex Mono 400/500 for node labels and service numbers. Big
Shoulders and IBM Plex Sans were removed with their `OFL.txt` files.

Archivo is vendored as one variable file,
`apps/web/src/fonts/archivo/archivo-variable.woff2` (about 50 kB), with the
project's `OFL.txt`. Google's legacy CSS endpoint only returns static
instances and cannot provide the width axis, so the source is the upstream
variable font from the official repository
(`Omnibus-Type/Archivo`, `fonts/variable/Archivo[wdth,wght].ttf`). The file
was produced with fonttools:

1. `fonttools varLib.instancer Archivo[wdth,wght].ttf wght=400:600
   wdth=100:112.5` limits the axes to the range the UI uses (body 400/500 at
   100 %, headings 600 at 112.5 %).
2. `pyftsubset --unicodes='U+0000-00FF,U+0100-017F,U+2010-2027,U+2030-203A,U+20AC,U+2122,U+2212'
   --layout-features='*' --flavor=woff2` keeps Latin, Latin Extended-A
   (Polish diacritics) and typographic punctuation (Polish quotes „ ”).

`apps/web/src/fonts.ts` loads it with `next/font/local` and
`weight: '400 600'`. Headings set `font-stretch: 112.5%`. Keep any new
vendored file under 60 kB; widening an axis range or the glyph set needs a
new measurement here.

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
