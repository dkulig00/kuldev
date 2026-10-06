import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  isBodyTooLarge,
  isInsideDir,
  isSameOrigin,
  MAX_BODY_BYTES,
  MAX_COMMENT_LENGTH,
  parseJson,
  readComment,
  resolveRepoRoot,
  toFileSlug,
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

describe('readComment', () => {
  it('returns the trimmed comment', () => {
    expect(readComment('  popraw nagłówek  ')).toBe('popraw nagłówek');
  });

  it('rejects empty or whitespace-only comments', () => {
    expect(readComment('')).toBeUndefined();
    expect(readComment('   \n  ')).toBeUndefined();
  });

  it('rejects non-string values', () => {
    expect(readComment(42)).toBeUndefined();
    expect(readComment(null)).toBeUndefined();
  });

  it('accepts exactly the maximum length and rejects one more', () => {
    expect(readComment('a'.repeat(MAX_COMMENT_LENGTH))).toHaveLength(
      MAX_COMMENT_LENGTH,
    );
    expect(readComment('a'.repeat(MAX_COMMENT_LENGTH + 1))).toBeUndefined();
  });
});

describe('toFileSlug', () => {
  it('lowercases a normal component name', () => {
    expect(toFileSlug('Hero')).toBe('hero');
  });

  it('removes path traversal characters', () => {
    const slug = toFileSlug('../../etc/passwd');

    expect(slug).toMatch(/^[a-z0-9_-]+$/);
    expect(slug).not.toContain('..');
    expect(slug).not.toContain('/');
  });

  it('falls back to "unknown" when nothing safe is left', () => {
    expect(toFileSlug('')).toBe('unknown');
    expect(toFileSlug('...')).toBe('-');
  });

  it('cuts the slug to 60 characters', () => {
    expect(toFileSlug('a'.repeat(100))).toHaveLength(60);
  });
});

describe('resolveRepoRoot', () => {
  it('finds the directory that contains .git, starting from apps/web', () => {
    const root = resolveRepoRoot(import.meta.dirname);

    expect(existsSync(path.join(root, '.git'))).toBe(true);
  });
});

describe('isInsideDir', () => {
  const dir = path.resolve('/repo/.ai-feedback');

  it('accepts a file directly inside the directory', () => {
    expect(isInsideDir(path.join(dir, 'x.json'), dir)).toBe(true);
  });

  it('rejects path traversal out of the directory', () => {
    expect(isInsideDir(path.join(dir, '..', 'secret.json'), dir)).toBe(false);
  });

  it('rejects a sibling directory that only shares the prefix', () => {
    expect(isInsideDir(`${dir}-evil/x.json`, dir)).toBe(false);
  });
});
