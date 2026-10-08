import { MotionProvider } from '@/components/motion';
import { getSiteUrl } from '@/config/site';
import { monoFont, sansFont } from '@/fonts';
import { routing } from '@/i18n/routing';
import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';
import * as rootParams from 'next/root-params';
import { ReactNode } from 'react';
import '../globals.css';

const DevFeedbackOverlay =
  process.env.NODE_ENV === 'development'
    ? dynamic(() =>
        import('@/components/dev-feedback/DevFeedbackOverlay').then(
          (module) => module.DevFeedbackOverlay,
        ),
      )
    : null;

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  const siteUrl = getSiteUrl();

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: siteUrl,
    alternates: {
      languages: {
        pl: new URL('/pl', siteUrl).toString(),
        en: new URL('/en', siteUrl).toString(),
        'x-default': new URL('/pl', siteUrl).toString(),
      },
    },
  };
}

export default async function LocaleLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const locale = await rootParams.locale();

  return (
    <html
      lang={locale}
      className={`${sansFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <MotionProvider>{children}</MotionProvider>
        </NextIntlClientProvider>
        {DevFeedbackOverlay && <DevFeedbackOverlay />}
      </body>
    </html>
  );
}
