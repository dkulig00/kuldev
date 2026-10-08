import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const navLabels = { pl: 'Usługi', en: 'Services' };

for (const locale of ['pl', 'en'] as const) {
  test.describe(`services section (${locale})`, () => {
    test('fits the iPhone SE screen without horizontal overflow', async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name !== 'iPhone SE', 'iPhone SE only');

      await page.goto(`/${locale}`);

      const viewportWidth = await page.evaluate(() => window.innerWidth);
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);

      const blocks = page.locator('#uslugi h2 + ul > li');
      await expect(blocks).toHaveCount(4);

      for (const block of await blocks.all()) {
        const box = await block.boundingBox();

        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(viewportWidth);
      }
    });

    test('navigation link scrolls to the section', async ({ page }) => {
      await page.goto(`/${locale}`);

      await page
        .getByRole('navigation', { name: 'Main' })
        .getByRole('link', { name: navLabels[locale] })
        .click();

      await expect(page).toHaveURL(/#uslugi$/);
      await expect(
        page.getByRole('heading', { level: 2, name: navLabels[locale] }),
      ).toBeInViewport();
    });

    test('has no WCAG 2.1 AA violations with a hovered block', async ({
      page,
    }) => {
      await page.goto(`/${locale}#uslugi`);

      await page.locator('#uslugi h2 + ul > li').nth(1).hover();

      const results = await new AxeBuilder({ page })
        .include('#uslugi')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  });
}
