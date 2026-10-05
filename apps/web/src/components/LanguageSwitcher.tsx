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
      className="flex gap-2"
    >
      {routing.locales.map((locale) => {
        const isActive = locale === currentLocale;

        return (
          <Link
            key={locale}
            href="/"
            locale={locale}
            aria-current={isActive ? 'page' : undefined}
            className={
              isActive ? 'text-ink font-semibold' : 'text-ink/60 hover:text-ink'
            }
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </nav>
  );
}
