import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const colorScheme of ['dark', 'light'] as const) {
  test.describe(`${colorScheme} theme`, () => {
    test.use({ colorScheme });

    for (const locale of ['pl', 'en']) {
      test(`no WCAG 2.1 AA violations on / ${locale}`, async ({ page }) => {
        await page.goto(`/${locale}`);

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();

        expect(results.violations).toEqual([]);
      });
    }
  });
}

test.describe('theme chosen with the toggle', () => {
  test.use({ colorScheme: 'dark' });

  test('no WCAG 2.1 AA violations after switching to light', async ({
    page,
  }) => {
    await page.goto('/pl');
    await page.getByRole('button', { name: 'Ciemny motyw' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
