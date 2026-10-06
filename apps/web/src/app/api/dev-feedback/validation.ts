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
