import { expect, test } from '@playwright/test';

test.describe('locale redirect from /', () => {
  test.use({ locale: 'pl-PL' });
  test('redirects to /pl for a Polish browser', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/pl\/?$/);
  });
});

test.describe('locale redirect from / (English)', () => {
  test.use({ locale: 'en-US' });
  test('redirects to /en for an English browser', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en\/?$/);
  });
});

test('/de returns 404', async ({ page }) => {
  const response = await page.goto('/de');
  expect(response?.status()).toBe(404);
});
