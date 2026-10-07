import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { CONTACT_EMAIL } from '@/config/contact';
import { navigationItems } from '@/config/navigation';
import { FADER_LEVEL, serviceIds } from '@/config/services';
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

  return (
    <>
      <Header
        navItems={navItems}
        ctaLabel={t('hero.cta')}
        ctaHref="#kontakt"
        currentLocale={locale}
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
          email={CONTACT_EMAIL}
          emailLabel={t('contact.emailLabel')}
        />
      </main>
      <Footer />
    </>
  );
}
