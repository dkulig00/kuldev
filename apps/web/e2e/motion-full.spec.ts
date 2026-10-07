import { expect, Locator, test } from '@playwright/test';

type SampledWindow = Window & { minRevealOpacity: number };

function opacityOf(locator: Locator) {
  return locator.evaluate((element) => getComputedStyle(element).opacity);
}

test.describe('reveal animation with motion enabled', () => {
  test.use({
    reducedMotion: 'no-preference',
    viewport: { width: 375, height: 400 },
  });

  test('content linked via #kontakt is visible at once and never hidden', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const sampled = window as unknown as SampledWindow;
      sampled.minRevealOpacity = 1;

      const sample = () => {
        const reveal = document.querySelector('#kontakt [data-reveal]');

        if (reveal) {
          sampled.minRevealOpacity = Math.min(
            sampled.minRevealOpacity,
            Number(getComputedStyle(reveal).opacity),
          );
        }

        requestAnimationFrame(sample);
      };

      requestAnimationFrame(sample);
    });

    await page.goto('/pl#kontakt');
    await page.waitForLoadState('networkidle');
    // Keep sampling for a while after hydration to catch a late flicker.
    await page.waitForTimeout(1500);

    const reveal = page.locator('#kontakt [data-reveal]');
    await expect(reveal).toHaveAttribute('data-reveal', 'static');

    const minOpacity = await page.evaluate(
      () => (window as unknown as SampledWindow).minRevealOpacity,
    );
    expect(minOpacity).toBe(1);
  });

  test('content below the fold reveals when scrolled into view', async ({
    page,
  }) => {
    await page.goto('/pl');

    const reveal = page.locator('#kontakt [data-reveal]');
    await expect(reveal).not.toBeInViewport();
    await expect(reveal).toHaveAttribute('data-reveal', 'armed');
    await expect.poll(() => opacityOf(reveal)).toBe('0');

    await reveal.scrollIntoViewIfNeeded();

    await expect.poll(() => opacityOf(reveal)).toBe('1');
  });
});
