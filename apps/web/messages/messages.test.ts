import { describe, expect, it } from 'vitest';
import en from './en.json';
import pl from './pl.json';

function flattenEntries(value: unknown, prefix = ''): [string, string][] {
  if (typeof value !== 'object' || value === null) {
    return [[prefix, String(value)]];
  }

  return Object.entries(value).flatMap(([key, nested]) =>
    flattenEntries(nested, prefix ? `${prefix}.${key}` : key),
  );
}

function flattenKeys(value: unknown): string[] {
  return flattenEntries(value).map(([key]) => key);
}

describe('messages', () => {
  it('pl.json and en.json expose the same set of keys', () => {
    const plKeys = flattenKeys(pl).sort();
    const enKeys = flattenKeys(en).sort();

    expect(enKeys).toEqual(plKeys);
  });

  it.each([
    ['pl', pl],
    ['en', en],
  ])('%s.json contains no em or en dashes', (_, messages) => {
    const withDashes = flattenEntries(messages).filter(([, text]) =>
      /[—–]/.test(text),
    );

    expect(withDashes).toEqual([]);
  });
});
