# 0009: Visual direction — Workflow

Date: 2026-10-08
Status: accepted
Supersedes: 0002

## Context

The "Studio" direction (ADR 0002) used an analog mixing-console metaphor
(faders, amber and cyan accents, Big Shoulders). It gave the site character
but did not explain the offer: kuldev builds software that does work for the
client (websites, mobile apps, process automation, AI agents, UX/UI design).
The audience is a business owner or manager looking for a contractor; they
should conclude "these people know what they are doing and will save me
time". Competitors in the same market use navy and light blue, stock photos
of people, 3D robots, star ratings and ALL-CAPS badges.

## Decision

### Metaphor: workflow

The visual language is data moving through the steps of a system. Source:
technical drawings and Dynamo node graphs (BIM automation is the founder's
background): rectangular nodes, orthogonal connectors (right angles only),
a construction grid, node labels in a technical monospace.

- The Hero shows one concrete, animated flow diagram ("Customer inquiry →
  AI agent → Reply + CRM entry"). It is the only place where the design
  takes a bold risk; everything around it stays quiet.
- Lines and nodes appear only where something flows (Hero, the connector
  between the active service and its panel, later "How I work"). Never as
  frame decoration.
- The accent means "work flows here". It is used for the primary CTA, the
  pulse and active node, and active states. Never as decoration.
- No ALL-CAPS labels, no arrows appended to buttons, no middle-dot meta
  strings, no pills, no shadows, no glassmorphism, no purple/blue gradients,
  glowing brains, robots, dot-cloud "neural networks", sparkle icons, stock
  3D. No invented numbers, ratings, testimonials or client logos.
- Monospace only for node labels and service numbers.
- Radii follow hierarchy: nodes 2 px, buttons 6 px.
- Background: a 32 px grid at ~3-4 % contrast, drawn with CSS gradients.

### Themes

Dark is the default. Without a stored choice, `prefers-color-scheme`
decides (works without JavaScript). A toggle in the header stores the
choice in `localStorage` (`kuldev-theme`). An inline script in `<head>`
applies a stored choice as `data-theme` on `<html>` before the first paint,
so there is no flash. The same script sets `data-js` on `<html>`; CSS that
only makes sense with JavaScript (hidden tab panels, the moving technology
strip) is scoped to `[data-js]`, so layout is final before the first paint
and nothing shifts on hydration. A custom implementation was chosen over
`next-themes` to avoid a new dependency and to own the `data-js` flag.

### Color tokens

Tokens live in `apps/web/src/app/globals.css` and are mapped through
Tailwind v4 `@theme inline`. Components use token names, never raw hex.

| token | dark | light | use |
|---|---|---|---|
| `bg` | `#16191C` | `#F4F5F2` | page background |
| `surface` | `#1E2226` | `#FFFFFF` | nodes, panels |
| `line` | `#2C3237` | `#D9DCD6` | grid, connectors, decorative borders |
| `muted` | `#9BA3A9` | `#565E63` | secondary text |
| `ink` | `#E8EAE6` | `#15181B` | primary text |
| `accent` | `#3FB68B` | `#3FB68B` | primary button fill, pulse, active node |
| `accent-ink` | `#0E1210` | `#0E1210` | text on `accent`, in both themes |
| `accent-text` | `#3FB68B` | `#0F7A55` | accent as text, links, active tab marker |
| `success` | `#7CB7F0` | `#1F5FA8` | success messages |
| `danger` | `#F2706B` | `#B3261E` | error messages |

The green accent is the brand color, not a "success" color. Success and
error states use their own tokens so they are never confused with the
brand. `success` and `danger` have no use yet (contact is `mailto:` only);
they exist for future forms and are covered by the contrast test.

Measured contrast (WCAG 2.1, required: text 4.5:1, UI components 3:1):

| pair | dark | light |
|---|---|---|
| `ink` on `bg` | 14.57 | 16.29 |
| `ink` on `surface` | 13.22 | 17.82 |
| `muted` on `bg` | 6.90 | 6.04 |
| `muted` on `surface` | 6.25 | 6.61 |
| `accent-text` on `bg` | 6.95 | 4.88 |
| `accent-text` on `surface` | 6.31 | 5.34 |
| `accent-ink` on `accent` | 7.44 | 7.44 |
| `success` on `bg` | 8.31 | 5.89 |
| `success` on `surface` | 7.54 | 6.44 |
| `danger` on `bg` | 6.14 | 5.97 |
| `danger` on `surface` | 5.57 | 6.54 |
| `accent` on `bg` (non-text) | 6.95 | 2.32 |
| `line` on `bg` (decorative) | 1.36 | 1.27 |

Rules that follow from the numbers:

- Light text on `accent` is not allowed; `accent-ink` is the only text color
  on an `accent` fill.
- In the light theme `accent` is only a fill, never text (`accent-text`
  takes that role). The primary button there gets a 1 px `accent-text`
  border (4.88:1), because the fill alone stands out at only 2.32:1. WCAG
  1.4.11 does not require it for a button with a text label, but the button
  should read clearly.
- `line` is decorative only. A border that identifies a control (inputs,
  focus rings) uses `muted` or `accent-text`.

### Typography

Self-hosted via `next/font/local` (ADR 0005):

- Archivo (variable, `wght` and `wdth` axes): headings at `font-stretch:
  112.5%` and weight 600, body at 100 % and 400/500. A wide, steady face
  with the character of technical signage.
- IBM Plex Mono 400/500: node labels and service numbers only.

Type scale 1.25 from 16 px (16 / 20 / 25 / 31 / 39 / 49 / 61), Hero up to
~72 px via `clamp()`. Headings line-height 1.05-1.1, body 1.6, measure
about 68 characters. Spacing on an 8 px base. Everything left-aligned.

## Risk if ignored

Drifting back to generic "AI" visuals (blue/purple gradients, neon on black,
SaaS card grids with shadows) or to the competitors' look makes the site
read as a template and undermines the "engineering precision" positioning.
Raw hex values in components or new color pairs without a contrast check
break WCAG AA in one of the two themes. Applying the theme or `data-js`
after hydration causes a theme flash and layout shift.

## Revisit when

The brand is formally revisited, a new UI state or color pair appears that
the contrast table does not cover, or a third theme (e.g. high contrast) is
needed.
