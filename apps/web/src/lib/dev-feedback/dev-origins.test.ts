import { describe, expect, it } from 'vitest';
import { parseDevAllowedOrigins } from './dev-origins';

describe('parseDevAllowedOrigins', () => {
  it('returns undefined when the variable is unset or has no entries', () => {
    expect(parseDevAllowedOrigins(undefined)).toBeUndefined();
    expect(parseDevAllowedOrigins('')).toBeUndefined();
    expect(parseDevAllowedOrigins(' , ')).toBeUndefined();
  });

  it('splits on commas, trims spaces and drops empty entries', () => {
    expect(parseDevAllowedOrigins('192.168.1.50, localhost,,')).toEqual([
      '192.168.1.50',
      'localhost',
    ]);
  });
});
