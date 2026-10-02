# 0002: Visual direction — Studio (analog mixing console)

Date: 2026-10-02
Status: accepted

## Context

kuldev.pl needed a distinctive, non-templated visual identity for a
web/mobile/AI-automation studio targeting business clients. Generic
"AI-generated" defaults (warm cream + terracotta, black background + a single
neon accent, SaaS card kit with uniform rounded corners/shadows) would make the
site indistinguishable from a template, undermining the "modern, concrete, with
character" positioning the brief asked for.

## Decision

Adopt the "Studio" direction: an analog mixing-console metaphor used as real
information structure, not decoration. Dark warm-charcoal palette (`#15130f`
background, `#221f19` panel, `#f3efe6` ink), with amber (`#ffb020`) as the
primary accent and cyan (`#4fd6c4`) as a secondary accent — both always paired
with dark text to guarantee WCAG AA contrast (verified ≥10:1 for the actually
used combinations; light `ink` on either accent is explicitly disallowed,
measured at 1.56:1). Typography: Big Shoulders (headlines), IBM Plex Sans
(body), IBM Plex Mono (numeric/data labels), loaded via `next/font/google` with
the `latin-ext` subset for Polish diacritics. Tokens are defined once in
`globals.css` via Tailwind v4's `@theme`, so components reference token names
(`bg-background`, `text-ink`, `bg-accent-amber`...), never raw hex values.

## Risk if ignored

Reverting to ad-hoc hex values in components, or drifting back toward generic
defaults (cream/terracotta, SaaS card shadows, ALL-CAPS labels, arrow-suffixed
CTAs), would make the site read as AI-generated and dilute the brand's
"nowoczesna, konkretna, z charakterem" positioning.

## Revisit when

The visual direction is formally revisited (e.g. a rebrand), or an
accessibility audit finds a new UI state/color combination not covered by the
contrast checks already made for this direction.
