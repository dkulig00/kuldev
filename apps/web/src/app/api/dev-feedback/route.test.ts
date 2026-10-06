// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';
import { MAX_BODY_BYTES } from './validation';

afterEach(() => {
  vi.unstubAllEnvs();
});

function jsonRequest(
  contentType: string,
  origin: string | null = 'http://localhost:3000',
  body = '{}',
) {
  const headers: Record<string, string> = {
    'Content-Type': contentType,
    Host: 'localhost:3000',
  };
  if (origin) headers.Origin = origin;

  return new Request('http://localhost:3000/api/dev-feedback', {
    method: 'POST',
    headers,
    body,
  });
}

describe('POST /api/dev-feedback', () => {
  it('returns 404 outside development', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const response = await POST(jsonRequest('application/json'));

    expect(response.status).toBe(404);
  });

  it('returns 415 when Content-Type is not application/json', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    const response = await POST(jsonRequest('text/plain'));

    expect(response.status).toBe(415);
  });

  it('returns 403 when Origin is missing', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    const response = await POST(jsonRequest('application/json', null));

    expect(response.status).toBe(403);
  });

  it('returns 403 when Origin comes from another host', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    const response = await POST(
      jsonRequest('application/json', 'http://evil.example'),
    );

    expect(response.status).toBe(403);
  });

  it('returns 413 when the declared body is larger than 50 kB', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const request = jsonRequest('application/json');
    request.headers.set('content-length', String(MAX_BODY_BYTES + 1));

    const response = await POST(request);

    expect(response.status).toBe(413);
  });

  it('returns 413 when the received body is larger than 50 kB', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const body = 'x'.repeat(MAX_BODY_BYTES + 1);

    const response = await POST(
      jsonRequest('application/json', 'http://localhost:3000', body),
    );

    expect(response.status).toBe(413);
  });

  it('returns 400 for invalid JSON', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    const response = await POST(
      jsonRequest('application/json', 'http://localhost:3000', '{not json'),
    );

    expect(response.status).toBe(400);
  });

  it('passes the checks for a valid same-origin request', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    const response = await POST(
      jsonRequest(
        'application/json',
        'http://localhost:3000',
        '{"comment":"ok"}',
      ),
    );

    expect(response.status).toBe(501);
  });
});
