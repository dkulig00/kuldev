import { expect, test } from '@playwright/test';

for (const locale of ['pl', 'en']) {
  test(`no horizontal overflow on / ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}`);

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const viewportWidth = await page.evaluate(() => window.innerWidth);

    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
  });
}
