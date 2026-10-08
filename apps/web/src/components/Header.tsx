import { Link } from '@/i18n/navigation';
import { devComponentProps } from '@/lib/dev-feedback/component-tag';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

interface NavLinkItem {
  id: string;
  label: string;
}

interface HeaderProps {
  navItems: NavLinkItem[];
  ctaLabel: string;
  ctaHref: string;
  currentLocale: string;
  themeLabel: string;
}

export function Header({
  navItems,
  ctaLabel,
  ctaHref,
  currentLocale,
  themeLabel,
}: Readonly<HeaderProps>) {
  return (
    <header
      {...devComponentProps('Header', 'src/components/Header.tsx')}
      className="border-line bg-bg border-b"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-1 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-heading text-ink focus-visible:outline-accent-text flex items-baseline gap-1.5 text-xl focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          kuldev
          <span aria-hidden="true" className="bg-accent size-2" />
        </Link>

        <nav
          aria-label="Main"
          className="order-last flex w-full gap-6 md:order-none md:w-auto"
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-muted hover:text-ink focus-visible:outline-accent-text py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher currentLocale={currentLocale} />
          <ThemeToggle label={themeLabel} />
          <a
            href={ctaHref}
            className="bg-accent text-accent-ink border-accent-text hover:bg-accent/85 focus-visible:outline-accent-text inline-flex min-h-11 items-center rounded-md border px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </header>
  );
}
