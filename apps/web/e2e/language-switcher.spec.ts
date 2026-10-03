import { expect, test } from '@playwright/test';

test('switches from Polish to English and back', async ({ page }) => {
  await page.goto('/pl');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pl');

  const switcher = page.getByRole('navigation', { name: 'Language switcher' });
  await switcher.getByRole('link', { name: 'EN' }).click();

  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await switcher.getByRole('link', { name: 'PL' }).click();

  await expect(page).toHaveURL(/\/pl\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
});
