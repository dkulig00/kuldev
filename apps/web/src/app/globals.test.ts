import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(path.join(import.meta.dirname, 'globals.css'), 'utf8');
const adr = readFileSync(
  path.join(
    import.meta.dirname,
    '../../../../docs/decisions/0009-visual-direction-workflow.md',
  ),
  'utf8',
);

type Tokens = Record<string, string>;

function tokensOf(selector: string): Tokens {
  const start = css.indexOf(`${selector} {`);

  if (start === -1) {
    throw new Error(`Missing block: ${selector}`);
  }

  const body = css.slice(start, css.indexOf('}', start));
  const entries = [...body.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6});/gi)].map(
    ([, name, value]) => [name, value.toLowerCase()],
  );

  return Object.fromEntries(entries);
}

function luminance(hex: string) {
  const channels = [1, 3, 5].map((index) => {
    const value = Number.parseInt(hex.slice(index, index + 2), 16) / 255;

    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground: string, background: string) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );

  return (lighter + 0.05) / (darker + 0.05);
}

// Every pair from the ADR 0009 contrast table that carries text or
// identifies a control, with the WCAG AA minimum it must meet.
const requiredPairs: [string, string, number][] = [
  ['ink', 'bg', 4.5],
  ['ink', 'surface', 4.5],
  ['muted', 'bg', 4.5],
  ['muted', 'surface', 4.5],
  ['accent-text', 'bg', 4.5],
  ['accent-text', 'surface', 4.5],
  ['accent-ink', 'accent', 4.5],
  ['success', 'bg', 4.5],
  ['success', 'surface', 4.5],
  ['danger', 'bg', 4.5],
  ['danger', 'surface', 4.5],
];

const themes = {
  dark: tokensOf(':root'),
  light: tokensOf(":root[data-theme='light']"),
};

function adrValue(foreground: string, background: string, theme: string) {
  const row = adr.match(
    new RegExp(
      `\\| \`${foreground}\` on \`${background}\`[^|]*\\| ([\\d.]+) \\| ([\\d.]+) \\|`,
    ),
  );

  if (!row) {
    throw new Error(`ADR 0009 has no row for ${foreground} on ${background}`);
  }

  return Number(theme === 'dark' ? row[1] : row[2]);
}

describe('globals.css theme tokens', () => {
  it('computes WCAG contrast correctly', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    // Positive control: the accent as text on the light background is a
    // known failure (ADR 0009), so the checks below are able to fail.
    expect(contrastRatio('#3fb68b', '#f4f5f2')).toBeLessThan(4.5);
  });

  it('defines the same light tokens for the system setting and the toggle', () => {
    expect(tokensOf(":root:not([data-theme='dark'])")).toEqual(themes.light);
  });

  it('defines the same token names in both themes', () => {
    expect(Object.keys(themes.light).sort()).toEqual(
      Object.keys(themes.dark).sort(),
    );
  });

  describe.each(Object.entries(themes))('%s theme', (theme, tokens) => {
    it.each(requiredPairs)(
      '%s on %s meets %s:1 and matches ADR 0009',
      (foreground, background, minimum) => {
        const ratio = contrastRatio(tokens[foreground], tokens[background]);

        expect(ratio).toBeGreaterThanOrEqual(minimum);
        expect(ratio).toBeCloseTo(adrValue(foreground, background, theme), 2);
      },
    );
  });
});
