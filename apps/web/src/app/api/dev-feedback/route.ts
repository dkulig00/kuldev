import {
  isBodyTooLarge,
  isSameOrigin,
  MAX_BODY_BYTES,
  parseJson,
  readComment,
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

  const body = parseJson(text);
  if (typeof body !== 'object' || body === null) {
    return new Response(null, { status: 400 });
  }

  const comment = readComment('comment' in body ? body.comment : undefined);
  if (comment === undefined) {
    return new Response(null, { status: 400 });
  }

  // Placeholder until validation and file writing are added.
  return new Response(null, { status: 501 });
}
