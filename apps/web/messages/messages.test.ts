import { describe, expect, it } from 'vitest';
import en from './en.json';
import pl from './pl.json';

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, nested]) =>
    flattenKeys(nested, prefix ? `${prefix}.${key}` : key),
  );
}

describe('messages', () => {
  it('pl.json and en.json expose the same set of keys', () => {
    const plKeys = flattenKeys(pl).sort();
    const enKeys = flattenKeys(en).sort();

    expect(enKeys).toEqual(plKeys);
  });
});
