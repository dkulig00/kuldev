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

export interface FeedbackPayload {
  url: string;
  language: string;
  viewport: { width: number; height: number };
  userAgent: string;
  selector: string;
  componentName: string;
  componentFile: string;
  textSnippet: string;
  comment: string;
}

// Returns the value if it is a string within the limit, otherwise undefined.
function readText(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== 'string' || value.length > maxLength) return undefined;
  return value;
}

// Viewport sizes are whole numbers between 1 and 20000.
function readDimension(value: unknown): number | undefined {
  if (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 20000
  ) {
    return value;
  }
  return undefined;
}

// Validates the whole request body. Returns undefined if any required field is wrong.
export function readPayload(body: unknown): FeedbackPayload | undefined {
  if (typeof body !== 'object' || body === null) return undefined;

  const fields = body as Record<string, unknown>;
  const viewport = fields.viewport as
    Record<string, unknown> | null | undefined;
  if (typeof viewport !== 'object' || viewport === null) return undefined;

  const url = readText(fields.url, 2048);
  const language = readText(fields.language, 10);
  const userAgent = readText(fields.userAgent, 512);
  const selector = readText(fields.selector, 1000);
  const componentName = readText(fields.componentName, 200);
  const componentFile =
    fields.componentFile === undefined
      ? ''
      : readText(fields.componentFile, 300);
  const width = readDimension(viewport.width);
  const height = readDimension(viewport.height);
  const comment = readComment(fields.comment);

  if (
    url === undefined ||
    language === undefined ||
    userAgent === undefined ||
    selector === undefined ||
    componentName === undefined ||
    componentFile === undefined ||
    width === undefined ||
    height === undefined ||
    comment === undefined
  ) {
    return undefined;
  }

  // Long snippets are cut, not rejected: they are only context for the AI.
  const textSnippet =
    typeof fields.textSnippet === 'string'
      ? fields.textSnippet.slice(0, 1000)
      : '';

  return {
    url,
    language,
    viewport: { width, height },
    userAgent,
    selector,
    componentName,
    componentFile,
    textSnippet,
    comment,
  };
}
