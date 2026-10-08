import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { CONTACT_EMAIL } from '@/config/contact';
import { navigationItems } from '@/config/navigation';
import { FADER_LEVEL, serviceIds } from '@/config/services';
import { mailtoHref } from '@/lib/mailto';
import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';

export default async function HomePage() {
  const locale = await rootParams.locale();
  const t = await getTranslations();

  const navItems = navigationItems.map((item) => ({
    id: item.id,
    label: t(item.labelKey as Parameters<typeof t>[0]),
  }));

  const serviceChannels = serviceIds.map((id) => ({
    id,
    title: t(`services.items.${id}.title`),
    description: t(`services.items.${id}.description`),
    features: t.raw(`services.items.${id}.features`) as string[],
    ctaLabel: t(`services.items.${id}.cta`),
  }));

  const contactPaths = [
    {
      id: 'short',
      title: t('contact.paths.short.title'),
      description: t('contact.paths.short.description'),
      ctaLabel: t('contact.paths.short.cta'),
      href: mailtoHref(CONTACT_EMAIL, {
        subject: t('contact.paths.short.subject'),
      }),
    },
    {
      id: 'brief',
      title: t('contact.paths.brief.title'),
      description: t('contact.paths.brief.description'),
      ctaLabel: t('contact.paths.brief.cta'),
      href: mailtoHref(CONTACT_EMAIL, {
        subject: t('contact.paths.brief.subject'),
        body: (t.raw('contact.paths.brief.questions') as string[]).join('\n\n'),
      }),
    },
  ];

  return (
    <>
      <Header
        navItems={navItems}
        ctaLabel={t('hero.cta')}
        ctaHref="#kontakt"
        currentLocale={locale}
        themeLabel={t('theme.dark')}
      />
      <main className="flex-1">
        <Hero
          title={t('hero.title')}
          subtitle={t('hero.subtitle')}
          ctaLabel={t('hero.cta')}
          ctaHref="#kontakt"
        />
        <Services
          heading={t('services.heading')}
          channels={serviceChannels}
          closing={t('services.closing')}
          ctaHref="#kontakt"
          level={FADER_LEVEL}
        />
        <Contact
          heading={t('contact.heading')}
          body={t('contact.body')}
          paths={contactPaths}
        />
      </main>
      <Footer />
    </>
  );
}
