import { existsSync } from 'node:fs';
import path from 'node:path';

export function isSameOrigin(
  origin: string | null,
  host: string | null,
): boolean {
  if (!origin || !host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export const MAX_BODY_BYTES = 50 * 1024;

export function isBodyTooLarge(contentLength: string | null): boolean {
  return Number(contentLength ?? 0) > MAX_BODY_BYTES;
}

// Returns undefined for invalid JSON, so callers can check it without try/catch.
export function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

export const MAX_COMMENT_LENGTH = 5000;

// Narrows unknown JSON to a trimmed comment of 1–5000 characters, or undefined.
export function readComment(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;

  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_COMMENT_LENGTH) {
    return undefined;
  }

  return trimmed;
}

// Reduces a component name to [a-z0-9_-], so it is safe inside a file name.
export function toFileSlug(componentName: string): string {
  return (
    componentName
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .toLowerCase()
      .slice(0, 60) || 'unknown'
  );
}

// Walks up from `start` until a directory containing .git is found.
// Falls back to `start` itself if none is found within maxDepth levels.
export function resolveRepoRoot(start = process.cwd(), maxDepth = 10): string {
  let dir = path.resolve(start);

  for (let depth = 0; depth < maxDepth; depth++) {
    if (existsSync(path.join(dir, '.git'))) return dir;

    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return path.resolve(start);
}

// True only if `target` resolves to a location strictly inside `dir`.
export function isInsideDir(target: string, dir: string): boolean {
  return path.resolve(target).startsWith(path.resolve(dir) + path.sep);
}
