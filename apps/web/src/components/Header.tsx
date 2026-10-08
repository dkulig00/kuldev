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
      className="border-line bg-bg/80 sticky top-0 z-40 border-b backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 sm:px-6 md:flex-nowrap md:gap-8">
        <Link
          href="/"
          className="font-heading text-ink focus-visible:outline-accent-text order-1 flex items-baseline gap-1.5 text-xl focus-visible:outline-2 focus-visible:outline-offset-4 md:order-none"
        >
          kuldev
          <span aria-hidden="true" className="bg-accent size-2" />
        </Link>

        <nav
          aria-label="Main"
          className="order-4 flex gap-4 sm:gap-6 md:order-none"
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-muted hover:text-ink focus-visible:text-ink focus-visible:outline-accent-text after:bg-accent relative py-2 after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:after:scale-x-100 motion-reduce:after:transition-none"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="order-2 ml-auto flex items-center gap-1 md:order-none">
          <LanguageSwitcher currentLocale={currentLocale} />
          <ThemeToggle label={themeLabel} />
        </div>

        {/* Phones: start a new row for navigation and the CTA. */}
        <div aria-hidden="true" className="order-3 basis-full md:hidden" />

        <a
          href={ctaHref}
          className="bg-accent text-accent-ink border-accent-text hover:bg-accent/85 focus-visible:outline-accent-text order-5 ml-auto inline-flex min-h-11 items-center rounded-md border px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-4 md:order-none md:ml-0"
        >
          {ctaLabel}
        </a>
      </div>
    </header>
  );
}
