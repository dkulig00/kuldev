import { expect, test } from '@playwright/test';

for (const locale of ['pl', 'en']) {
  test(`hreflang tags are present on / ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}`);

    await expect(
      page.locator('link[rel="alternate"][hreflang="pl"]'),
    ).toHaveAttribute('href', /\/pl$/);
    await expect(
      page.locator('link[rel="alternate"][hreflang="en"]'),
    ).toHaveAttribute('href', /\/en$/);
    await expect(
      page.locator('link[rel="alternate"][hreflang="x-default"]'),
    ).toHaveAttribute('href', /\/pl$/);
  });
}
