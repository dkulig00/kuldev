import { expect, Locator, Page, test } from '@playwright/test';

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

type FaderWindow = Window & { capTransforms: string[] };

function firstCap(page: Page) {
  return page.locator('#uslugi [data-scroll]').nth(1);
}

function transformOf(locator: Locator) {
  return locator.evaluate((element) => getComputedStyle(element).transform);
}

async function sampleCapTransforms(page: Page) {
  await page.addInitScript(() => {
    const sampled = window as unknown as FaderWindow;
    sampled.capTransforms = [];

    const sample = () => {
      const cap = document.querySelectorAll('#uslugi [data-scroll]')[1];

      if (cap) {
        const transform = getComputedStyle(cap).transform;

        if (!sampled.capTransforms.includes(transform)) {
          sampled.capTransforms.push(transform);
        }
      }

      requestAnimationFrame(sample);
    };

    requestAnimationFrame(sample);
  });
}

async function expectCapNeverMoved(page: Page) {
  await page.waitForLoadState('networkidle');
  // Keep sampling for a while after hydration to catch a late jump.
  await page.waitForTimeout(1500);

  await expect(firstCap(page)).toHaveAttribute('data-scroll', 'static');

  const transforms = await page.evaluate(
    () => (window as unknown as FaderWindow).capTransforms,
  );
  expect(transforms).toHaveLength(1);
}

test.describe('fader scroll transform with motion enabled', () => {
  test.use({ reducedMotion: 'no-preference' });

  test.describe('on a small screen', () => {
    test.use({ viewport: { width: 375, height: 400 } });

    test('faders below the fold move as the section scrolls in', async ({
      page,
    }) => {
      await page.goto('/pl');

      const cap = firstCap(page);
      await expect(cap).not.toBeInViewport();
      await expect(cap).toHaveAttribute('data-scroll', 'active');
      await page.waitForLoadState('networkidle');

      const before = await transformOf(cap);
      await page.locator('#kontakt').scrollIntoViewIfNeeded();

      await expect.poll(() => transformOf(cap)).not.toBe(before);
    });

    test('faders linked via #uslugi never move', async ({ page }) => {
      await sampleCapTransforms(page);

      await page.goto('/pl#uslugi');

      await expectCapNeverMoved(page);
    });
  });

  test.describe('on a tall screen', () => {
    test.use({ viewport: { width: 1280, height: 1600 } });

    test('faders visible from the start never move', async ({ page }) => {
      await sampleCapTransforms(page);

      await page.goto('/pl');
      await expect(firstCap(page)).toBeInViewport();

      await expectCapNeverMoved(page);
    });
  });
});
