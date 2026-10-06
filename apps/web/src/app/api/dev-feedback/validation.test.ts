import { describe, expect, it } from 'vitest';
import {
  isBodyTooLarge,
  isSameOrigin,
  MAX_BODY_BYTES,
  parseJson,
} from './validation';

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

describe('isBodyTooLarge', () => {
  it('accepts a body exactly at the limit', () => {
    expect(isBodyTooLarge(String(MAX_BODY_BYTES))).toBe(false);
  });

  it('rejects a body one byte over the limit', () => {
    expect(isBodyTooLarge(String(MAX_BODY_BYTES + 1))).toBe(true);
  });

  it('does not treat a missing Content-Length as too large', () => {
    expect(isBodyTooLarge(null)).toBe(false);
  });
});

describe('parseJson', () => {
  it('returns the parsed value for valid JSON', () => {
    expect(parseJson('{"comment":"ok"}')).toEqual({ comment: 'ok' });
  });

  it('returns undefined for invalid JSON', () => {
    expect(parseJson('{not json')).toBeUndefined();
  });
});
