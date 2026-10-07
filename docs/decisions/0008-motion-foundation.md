# 0008: Motion foundation

Date: 2026-10-07
Status: accepted

## Context

The "Studio" direction (ADR 0002) calls for a site with character, and motion
is part of that. Without shared rules, each component would add its own
effects: scattered fade-ups, animated layout properties, and content hidden
until JavaScript loads. That hurts accessibility, Core Web Vitals and the
"not a template" positioning.

## Decision

- Use Motion (`motion`) as the only animation library. No other animation or
  smooth-scroll libraries.
- Render `m.*` components inside `LazyMotion strict`. Load `domAnimation`
  asynchronously, so it stays off the critical path. Do not use `domMax`.
- Respect `prefers-reduced-motion` globally with
  `MotionConfig reducedMotion="user"`. Because that setting still animates
  opacity, primitives also check `useReducedMotion()` and skip animation
  entirely. Without motion the page is complete.
- Animate only `transform` (x, y, scale, rotate) and `opacity`. Primitive
  props do not accept other properties.
- Content is visible without JavaScript. Server-rendered HTML never contains a
  hidden state. `Reveal` hides an element only after hydration, only when it
  is fully below the viewport, and never when `location.hash` targets the
  element, an ancestor or a descendant. Hiding and revealing both run in the
  lazily loaded feature bundle, so a slow or failed chunk leaves content
  visible.
- The Hero has no entrance animation.
- Animated parts are small client components in `src/components/motion/`.
  Sections stay Server Components and only wrap their content. ESLint blocks
  `motion` imports outside that directory.
- A new primitive is added together with its first real use on the page.
- Non-user-triggered motion is used sparingly: one deliberate moment, not an
  effect on every section.

## Risk if ignored

Content hidden behind JavaScript disappears for visitors arriving via
`/pl#kontakt` links, on slow networks or when a chunk fails, and for search
engines. Ignoring reduced motion harms users with vestibular disorders.
Animating layout properties causes jank and layout shift. Importing full
`motion.*` adds about 30 kB to the critical path.

## Revisit when

Motion's API or bundle strategy changes in a major version, the browser
support of CSS scroll-driven animations makes a library unnecessary for our
use cases, or a section needs layout animations (`domMax`).
