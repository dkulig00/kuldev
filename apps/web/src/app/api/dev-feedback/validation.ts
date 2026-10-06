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
