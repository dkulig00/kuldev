import { render, screen } from '@testing-library/react';
import type { AriaAttributes, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { LanguageSwitcher } from './LanguageSwitcher';

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    locale,
    href,
    children,
    'aria-current': ariaCurrent,
  }: {
    locale: string;
    href: string;
    children: ReactNode;
    'aria-current'?: AriaAttributes['aria-current'];
  }) => (
    <a
      href={`/${locale}${href === '/' ? '' : href}`}
      aria-current={ariaCurrent}
    >
      {children}
    </a>
  ),
}));

describe('LanguageSwitcher', () => {
  it('renders a link for each locale and marks the current one as active', () => {
    render(<LanguageSwitcher currentLocale="pl" />);

    const plLink = screen.getByRole('link', { name: 'PL' });
    const enLink = screen.getByRole('link', { name: 'EN' });

    expect(plLink).toHaveAttribute('href', '/pl');
    expect(enLink).toHaveAttribute('href', '/en');

    expect(plLink).toHaveAttribute('aria-current', 'page');
    expect(enLink).not.toHaveAttribute('aria-current');
  });
});
