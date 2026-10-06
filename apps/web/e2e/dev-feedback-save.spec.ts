import { expect, test } from '@playwright/test';
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';

// Playwright runs from apps/web (see the package.json script), so the repo root is two levels up.
const feedbackDir = path.resolve(process.cwd(), '..', '..', '.ai-feedback');

test('saves a comment from the overlay as a JSON file', async ({ page }) => {
  const before = new Set(
    existsSync(feedbackDir) ? readdirSync(feedbackDir) : [],
  );

  await page.goto('/pl');
  await page.getByRole('button', { name: 'Zaznacz element' }).click();
  await page.locator('[data-component="Hero"] a').click();
  await page
    .getByRole('textbox', { name: 'Komentarz' })
    .fill('test z Playwright');
  await page.getByRole('button', { name: 'Wyślij' }).click();

  await expect(page.getByRole('dialog')).toBeHidden();

  const created = readdirSync(feedbackDir).filter((file) => !before.has(file));
  expect(created).toHaveLength(1);

  const filePath = path.join(feedbackDir, created[0]);
  try {
    const record = JSON.parse(readFileSync(filePath, 'utf8'));

    expect(record).toMatchObject({
      componentName: 'Hero',
      comment: 'test z Playwright',
      status: 'open',
    });
  } finally {
    rmSync(filePath);
  }
});
