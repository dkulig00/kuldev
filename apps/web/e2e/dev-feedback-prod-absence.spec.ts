import { expect, test } from '@playwright/test';

// Only meaningful against the production build: CI=1 makes the base config run `pnpm start`.
test.skip(!process.env.CI, 'runs against the production build only');

test('the feedback endpoint answers 404 in production', async ({ request }) => {
  const response = await request.post('/api/dev-feedback', {
    headers: { 'Content-Type': 'application/json' },
    data: {},
  });

  expect(response.status()).toBe(404);
});

test('the production page has no overlay and no component tags', async ({
  page,
}) => {
  await page.goto('/pl');

  await expect(page.locator('[data-component]')).toHaveCount(0);
  await expect(page.locator('[data-dev-feedback-ui]')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Zaznacz element' }),
  ).toHaveCount(0);
});
