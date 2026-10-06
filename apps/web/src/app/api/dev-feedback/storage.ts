import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { type FeedbackPayload, isInsideDir, toFileSlug } from './validation';

// Writes one feedback record as JSON and returns the path it was written to.
export async function saveFeedback(
  payload: FeedbackPayload,
  repoRoot: string,
  now = Date.now(),
): Promise<string> {
  const dir = path.join(repoRoot, '.ai-feedback');
  const target = path.join(
    dir,
    `${now}-${toFileSlug(payload.componentName)}.json`,
  );

  // Defence in depth: the slug already has no path separators, but verify anyway.
  if (!isInsideDir(target, dir)) {
    throw new Error('Refusing to write outside .ai-feedback');
  }

  await mkdir(dir, { recursive: true });
  await writeFile(
    target,
    JSON.stringify({ ...payload, status: 'open' }, null, 2),
  );

  return target;
}
