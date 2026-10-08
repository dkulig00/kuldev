import { expect, test } from '@playwright/test';

const expectedLinks = {
  pl: {
    short:
      'mailto:kontakt@kuldev.pl?subject=Zapytanie%20ze%20strony%20kuldev.pl',
    briefSubject: 'subject=Brief%20projektu',
    briefBodyStart: 'body=Firma%20i%20bran%C5%BCa%3A%0D%0A%0D%0A',
  },
  en: {
    short: 'mailto:kontakt@kuldev.pl?subject=Inquiry%20from%20kuldev.pl',
    briefSubject: 'subject=Project%20brief',
    briefBodyStart: 'body=Company%20and%20industry%3A%0D%0A%0D%0A',
  },
};

for (const locale of ['pl', 'en'] as const) {
  test(`CTA scrolls to #kontakt and both mailto paths are correct (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}`);

    await page.locator('a[href="#kontakt"]').first().click();

    const contact = page.locator('#kontakt');
    await expect(contact).toBeInViewport();

    const links = contact.locator('a[href^="mailto:"]');
    await expect(links).toHaveCount(2);

    await expect(links.nth(0)).toHaveAttribute(
      'href',
      expectedLinks[locale].short,
    );

    const brief = await links.nth(1).getAttribute('href');
    expect(brief).toContain(expectedLinks[locale].briefSubject);
    expect(brief).toContain(expectedLinks[locale].briefBodyStart);
  });
}
