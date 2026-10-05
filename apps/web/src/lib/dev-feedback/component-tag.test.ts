import { afterEach, describe, expect, it, vi } from 'vitest';
import { devComponentProps } from './component-tag';

describe('devComponentProps', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns data attributes in development', () => {
    vi.stubEnv('NODE_ENV', 'development');

    expect(devComponentProps('Hero', 'src/components/Hero.tsx')).toEqual({
      'data-component': 'Hero',
      'data-component-file': 'src/components/Hero.tsx',
    });
  });

  it('returns an empty object in production', () => {
    vi.stubEnv('NODE_ENV', 'production');

    expect(devComponentProps('Hero', 'src/components/Hero.tsx')).toEqual({});
  });
});
