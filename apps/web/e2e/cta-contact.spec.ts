import { expect, test } from '@playwright/test';

for (const locale of ['pl', 'en']) {
  test(`CTA scrolls to #kontakt and mailto link is correct (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}`);

    await page.locator('a[href="#kontakt"]').first().click();

    const contact = page.locator('#kontakt');
    await expect(contact).toBeInViewport();

    const mailtoLink = contact.locator('a[href^="mailto:"]');
    await expect(mailtoLink).toHaveAttribute(
      'href',
      'mailto:kontakt@kuldev.pl',
    );
  });
}
