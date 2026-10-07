import { expect, Locator, test } from '@playwright/test';

async function visualState(locator: Locator) {
  return locator.evaluate((element) => {
    const style = getComputedStyle(element);

    return { opacity: style.opacity, transform: style.transform };
  });
}

const fullyVisible = { opacity: '1', transform: 'none' };

for (const locale of ['pl', 'en']) {
  test.describe(`content visibility with reduced motion (${locale})`, () => {
    test.use({ viewport: { width: 375, height: 400 } });

    test('hero and contact are visible without any animation', async ({
      page,
    }) => {
      await page.goto(`/${locale}`);
      // Wait for hydration and the lazily loaded animation features.
      await page.waitForLoadState('networkidle');

      expect(await visualState(page.locator('h1'))).toEqual(fullyVisible);

      const reveal = page.locator('#kontakt [data-reveal]');
      await expect(reveal).toHaveAttribute('data-reveal', 'static');

      await reveal.scrollIntoViewIfNeeded();
      expect(await visualState(reveal)).toEqual(fullyVisible);
    });
  });

  test.describe(`content visibility without JavaScript (${locale})`, () => {
    test.use({ javaScriptEnabled: false });

    test('hero and contact are visible', async ({ page }) => {
      await page.goto(`/${locale}`);

      await expect(page.locator('h1')).toBeVisible();
      expect(await visualState(page.locator('h1'))).toEqual(fullyVisible);

      const reveal = page.locator('#kontakt [data-reveal]');
      await reveal.scrollIntoViewIfNeeded();
      await expect(reveal).toBeVisible();
      expect(await visualState(reveal)).toEqual(fullyVisible);
    });
  });
}
