import { cleanup, render, screen } from '@testing-library/react';
import type { AriaAttributes, ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from './Header';

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    locale,
    href,
    children,
    'aria-current': ariaCurrent,
  }: {
    locale?: string;
    href: string;
    children: ReactNode;
    'aria-current'?: AriaAttributes['aria-current'];
  }) => (
    <a
      href={locale ? `/${locale}${href === '/' ? '' : href}` : href}
      aria-current={ariaCurrent}
    >
      {children}
    </a>
  ),
}));

describe('Header', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders logo, nav items, language switcher, theme toggle and CTA', () => {
    render(
      <Header
        navItems={[{ id: 'kontakt', label: 'Kontakt' }]}
        ctaLabel="Wyceń projekt"
        ctaHref="#kontakt"
        currentLocale="pl"
        themeLabel="Ciemny motyw"
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Ciemny motyw' }),
    ).toHaveAttribute('aria-pressed', 'true');

    expect(screen.getByRole('link', { name: 'kuldev' })).toHaveAttribute(
      'href',
      '/',
    );

    const navLink = screen.getByRole('link', { name: 'Kontakt' });
    expect(navLink).toHaveAttribute('href', '#kontakt');

    expect(screen.getByRole('link', { name: 'PL' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'EN' })).toBeInTheDocument();

    const cta = screen.getByRole('link', { name: 'Wyceń projekt' });
    expect(cta).toHaveAttribute('href', '#kontakt');
  });
});
