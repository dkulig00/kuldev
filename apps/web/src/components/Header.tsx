import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavLinkItem {
  id: string;
  label: string;
}

interface HeaderProps {
  navItems: NavLinkItem[];
  ctaLabel: string;
  ctaHref: string;
  currentLocale: string;
}

export function Header({
  navItems,
  ctaLabel,
  ctaHref,
  currentLocale,
}: Readonly<HeaderProps>) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
      <Link href="/" className="font-display text-ink text-xl font-bold">
        kuldev
      </Link>

      <div className="flex flex-wrap items-center gap-4">
        <nav aria-label="Main" className="flex items-center gap-4">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-ink/80 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <LanguageSwitcher currentLocale={currentLocale} />

        <a
          href={ctaHref}
          className="bg-accent-amber text-background inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
        >
          {ctaLabel}
        </a>
      </div>
    </header>
  );
}
