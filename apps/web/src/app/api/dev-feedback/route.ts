import { saveFeedback } from './storage';
import {
  isBodyTooLarge,
  isSameOrigin,
  MAX_BODY_BYTES,
  parseJson,
  readPayload,
  resolveRepoRoot,
} from './validation';

// Dev-only endpoint: outside `next dev` it must behave as if it does not exist.
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return new Response(null, { status: 404 });
  }

  // Forms cannot send JSON cross-site, so this blocks simple-request CSRF.
  if (request.headers.get('content-type') !== 'application/json') {
    return new Response(null, { status: 415 });
  }

  // Second layer: the request must come from the same host it was sent to.
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!isSameOrigin(origin, host)) {
    return new Response(null, { status: 403 });
  }

  if (isBodyTooLarge(request.headers.get('content-length'))) {
    return new Response(null, { status: 413 });
  }

  // The declared size can be missing or wrong, so measure what actually arrived.
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    return new Response(null, { status: 413 });
  }

  // readPayload also rejects invalid JSON, because parseJson returns undefined for it.
  const payload = readPayload(parseJson(text));
  if (payload === undefined) {
    return new Response(null, { status: 400 });
  }

  await saveFeedback(payload, resolveRepoRoot());
  return new Response(null, { status: 201 });
}
