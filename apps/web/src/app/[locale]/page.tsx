import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CONTACT_EMAIL } from '@/config/contact';
import { navigationItems } from '@/config/navigation';
import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';

export default async function HomePage() {
  const locale = await rootParams.locale();
  const t = await getTranslations();

  const navItems = navigationItems.map((item) => ({
    id: item.id,
    label: t(item.labelKey as Parameters<typeof t>[0]),
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
