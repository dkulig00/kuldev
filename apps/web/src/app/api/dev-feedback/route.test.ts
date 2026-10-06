// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

afterEach(() => {
  vi.unstubAllEnvs();
});

function jsonRequest(
  contentType: string,
  origin: string | null = 'http://localhost:3000',
) {
  const headers: Record<string, string> = {
    'Content-Type': contentType,
    Host: 'localhost:3000',
  };
  if (origin) headers.Origin = origin;

  return new Request('http://localhost:3000/api/dev-feedback', {
    method: 'POST',
    headers,
    body: '{}',
  });
}

describe('POST /api/dev-feedback', () => {
  it('returns 404 outside development', () => {
    vi.stubEnv('NODE_ENV', 'production');

    const response = POST(jsonRequest('application/json'));

    expect(response.status).toBe(404);
  });

  it('returns 415 when Content-Type is not application/json', () => {
    vi.stubEnv('NODE_ENV', 'development');

    const response = POST(jsonRequest('text/plain'));

    expect(response.status).toBe(415);
  });

  it('returns 403 when Origin is missing', () => {
    vi.stubEnv('NODE_ENV', 'development');

    const response = POST(jsonRequest('application/json', null));

    expect(response.status).toBe(403);
  });

  it('returns 403 when Origin comes from another host', () => {
    vi.stubEnv('NODE_ENV', 'development');

    const response = POST(
      jsonRequest('application/json', 'http://evil.example'),
    );

    expect(response.status).toBe(403);
  });

  it('passes the checks for a same-origin request in development', () => {
    vi.stubEnv('NODE_ENV', 'development');

    const response = POST(jsonRequest('application/json'));

    expect(response.status).toBe(501);
  });
});
