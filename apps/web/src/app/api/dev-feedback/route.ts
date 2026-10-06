import { isSameOrigin } from './validation';

// Dev-only endpoint: outside `next dev` it must behave as if it does not exist.
export function POST(request: Request) {
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

  // Placeholder until validation and file writing are added.
  return new Response(null, { status: 501 });
}
