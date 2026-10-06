import { describe, expect, it } from 'vitest';
import { isSameOrigin } from './validation';

describe('isSameOrigin', () => {
  it('accepts an origin whose host and port match the Host header', () => {
    expect(isSameOrigin('http://192.168.1.50:3000', '192.168.1.50:3000')).toBe(
      true,
    );
  });

  it('rejects the same hostname on a different port', () => {
    expect(isSameOrigin('http://localhost:3001', 'localhost:3000')).toBe(false);
  });

  it('rejects a missing Origin or Host', () => {
    expect(isSameOrigin(null, 'localhost:3000')).toBe(false);
    expect(isSameOrigin('http://localhost:3000', null)).toBe(false);
  });

  it('rejects a malformed Origin such as "null"', () => {
    expect(isSameOrigin('null', 'localhost:3000')).toBe(false);
  });
});
