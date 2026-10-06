// @vitest-environment node
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { saveFeedback } from './storage';
import type { FeedbackPayload } from './validation';

const fs = vi.hoisted(() => ({ mkdir: vi.fn(), writeFile: vi.fn() }));
vi.mock('node:fs/promises', () => fs);

const payload: FeedbackPayload = {
  url: 'http://localhost:3000/pl',
  language: 'pl',
  viewport: { width: 375, height: 800 },
  userAgent: 'test-agent',
  selector: 'body > main > section',
  componentName: 'Hero',
  componentFile: 'src/components/Hero.tsx',
  textSnippet: 'Tytuł',
  comment: 'popraw odstęp',
};

beforeEach(() => {
  fs.mkdir.mockReset();
  fs.writeFile.mockReset();
});

describe('saveFeedback', () => {
  it('writes a timestamped, slugged file inside .ai-feedback', async () => {
    const target = await saveFeedback(payload, '/repo', 1700000000000);

    expect(target).toBe(
      path.join('/repo', '.ai-feedback', '1700000000000-hero.json'),
    );
    expect(fs.writeFile).toHaveBeenCalledWith(target, expect.any(String));
  });

  it('creates the directory recursively before writing', async () => {
    await saveFeedback(payload, '/repo', 1);

    expect(fs.mkdir).toHaveBeenCalledWith(path.join('/repo', '.ai-feedback'), {
      recursive: true,
    });
  });

  it('stores the payload with status "open"', async () => {
    await saveFeedback(payload, '/repo', 1);

    const written = JSON.parse(fs.writeFile.mock.calls[0][1]);

    expect(written).toMatchObject({ comment: 'popraw odstęp', status: 'open' });
  });

  it('keeps a path-traversal component name inside .ai-feedback', async () => {
    const target = await saveFeedback(
      { ...payload, componentName: '../../etc/passwd' },
      '/repo',
      1,
    );

    expect(path.dirname(target)).toBe(path.join('/repo', '.ai-feedback'));
  });
});
