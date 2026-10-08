import { expect, Page, test } from '@playwright/test';

const backgrounds = {
  dark: 'rgb(22, 25, 28)',
  light: 'rgb(244, 245, 242)',
};

type ThemeWindow = Window & {
  seenThemes: (string | null)[];
  firstFrameBackground: string | null;
};

// Records every data-theme value <html> ever had and the body background
// of the first animation frame, i.e. what the visitor sees first.
async function recordFirstPaint(page: Page, storedTheme?: string) {
  await page.addInitScript((theme) => {
    const recorded = window as unknown as ThemeWindow;
    recorded.seenThemes = [];
    recorded.firstFrameBackground = null;

    if (theme) {
      window.localStorage.setItem('kuldev-theme', theme);
    }

    new MutationObserver(() => {
      const value = document.documentElement?.getAttribute('data-theme');

      if (recorded.seenThemes.at(-1) !== value) {
        recorded.seenThemes.push(value ?? null);
      }
    }).observe(document, {
      attributes: true,
      attributeFilter: ['data-theme'],
      childList: true,
      subtree: true,
    });

    requestAnimationFrame(() => {
      recorded.firstFrameBackground = getComputedStyle(
        document.body,
      ).backgroundColor;
    });
  }, storedTheme);
}

async function firstPaint(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as ThemeWindow).firstFrameBackground,
      ),
    )
    .not.toBeNull();

  return page.evaluate(() => {
    const recorded = window as unknown as ThemeWindow;

    return {
      background: recorded.firstFrameBackground,
      themes: recorded.seenThemes,
    };
  });
}

function bodyBackground(page: Page) {
  return page.evaluate(() => getComputedStyle(document.body).backgroundColor);
}

test.describe('theme on a dark system', () => {
  test.use({ colorScheme: 'dark' });

  test('a stored light choice is painted first, without a dark flash', async ({
    page,
  }) => {
    await recordFirstPaint(page, 'light');
    await page.goto('/pl');

    const { background, themes } = await firstPaint(page);

    expect(background).toBe(backgrounds.light);
    expect(themes).not.toContain('dark');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('without a stored choice the system theme is painted first', async ({
    page,
  }) => {
    await recordFirstPaint(page);
    await page.goto('/pl');

    const { background } = await firstPaint(page);

    expect(background).toBe(backgrounds.dark);
    await expect(page.locator('html')).not.toHaveAttribute('data-theme');
  });

  test('the toggle switches the theme and remembers it after a reload', async ({
    page,
  }) => {
    await page.goto('/en');

    const toggle = page.getByRole('button', { name: 'Dark theme' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');

    await toggle.click();

    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(await bodyBackground(page)).toBe(backgrounds.light);

    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(
      page.getByRole('button', { name: 'Dark theme' }),
    ).toHaveAttribute('aria-pressed', 'false');
    expect(await bodyBackground(page)).toBe(backgrounds.light);
  });

  test('marks that JavaScript is running before hydration', async ({
    page,
  }) => {
    await page.goto('/pl');

    await expect(page.locator('html')).toHaveAttribute('data-js', '');
  });
});

test.describe('theme on a light system', () => {
  test.use({ colorScheme: 'light' });

  test('a stored dark choice wins over the system setting', async ({
    page,
  }) => {
    await recordFirstPaint(page, 'dark');
    await page.goto('/pl');

    const { background, themes } = await firstPaint(page);

    expect(background).toBe(backgrounds.dark);
    expect(themes).not.toContain('light');
  });
});

for (const colorScheme of ['dark', 'light'] as const) {
  test.describe(`theme without JavaScript (${colorScheme} system)`, () => {
    test.use({ colorScheme, javaScriptEnabled: false });

    test('follows the system setting', async ({ page }) => {
      await page.goto('/pl');

      expect(await bodyBackground(page)).toBe(backgrounds[colorScheme]);
      await expect(page.locator('html')).not.toHaveAttribute('data-js');
    });
  });
}
