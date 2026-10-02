import { describe, expect, it, vi } from 'vitest';

vi.mock('next/root-params', () => ({
  locale: async () => 'pl',
}));

vi.mock('@/fonts', () => ({
  headlineFont: { variable: '--font-big-shoulders' },
  bodyFont: { variable: '--font-plex-sans' },
  monoFont: { variable: '--font-plex-mono' },
}));

vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => {
    const messages: Record<string, string> = {
      title: 'kuldev — test title',
      description: 'kuldev — test description',
    };
    return messages[key] ?? key;
  },
}));

process.env.SITE_URL = 'http://localhost:3000';

describe('[locale]/layout', () => {
  it('only allows the configured locales via generateStaticParams', async () => {
    const { generateStaticParams } = await import('./layout');

    expect(generateStaticParams()).toEqual([
      { locale: 'pl' },
      { locale: 'en' },
    ]);
  });

  it('disables rendering for unconfigured locales', async () => {
    const { dynamicParams } = await import('./layout');

    expect(dynamicParams).toBe(false);
  });

  it('builds metadata with an absolute hreflang for each locale plus x-default', async () => {
    const { generateMetadata } = await import('./layout');
    const metadata = await generateMetadata();

    expect(metadata.title).toBe('kuldev — test title');
    expect(metadata.description).toBe('kuldev — test description');
    expect(metadata.alternates?.languages).toEqual({
      pl: 'http://localhost:3000/pl',
      en: 'http://localhost:3000/en',
      'x-default': 'http://localhost:3000/pl',
    });
  });
});
