import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { devComponentProps } from '@/lib/dev-feedback/component-tag';

interface LanguageSwitcherProps {
  currentLocale: string;
}

const localeLabels: Record<string, string> = {
  pl: 'PL',
  en: 'EN',
};

export function LanguageSwitcher({
  currentLocale,
}: Readonly<LanguageSwitcherProps>) {
  return (
    <nav
      {...devComponentProps(
        'LanguageSwitcher',
        'src/components/LanguageSwitcher.tsx',
      )}
      aria-label="Language switcher"
      className="flex"
    >
      {routing.locales.map((locale) => {
        const isActive = locale === currentLocale;

        return (
          <Link
            key={locale}
            href="/"
            locale={locale}
            aria-current={isActive ? 'page' : undefined}
            className={`focus-visible:outline-accent-text inline-flex min-h-11 min-w-9 items-center justify-center text-sm font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 ${
              isActive
                ? 'text-ink decoration-accent-text underline decoration-2 underline-offset-6'
                : 'text-muted hover:text-ink'
            }`}
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </nav>
  );
}
