import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Footer } from './Footer';

function renderFooter() {
  return render(
    <Footer
      navItems={[
        { id: 'uslugi', label: 'Usługi' },
        { id: 'kontakt', label: 'Kontakt' },
      ]}
      email="kontakt@kuldev.pl"
    />,
  );
}

describe('Footer', () => {
  afterEach(cleanup);

  it('renders the company name and the current year', () => {
    renderFooter();

    const year = new Date().getFullYear().toString();
    expect(screen.getByText(`© ${year} kuldev`)).toBeInTheDocument();
  });

  it('links to the page sections and the contact email', () => {
    renderFooter();

    const nav = within(screen.getByRole('navigation', { name: 'Footer' }));

    expect(nav.getByRole('link', { name: 'Usługi' })).toHaveAttribute(
      'href',
      '#uslugi',
    );
    expect(nav.getByRole('link', { name: 'Kontakt' })).toHaveAttribute(
      'href',
      '#kontakt',
    );
    expect(
      nav.getByRole('link', { name: 'kontakt@kuldev.pl' }),
    ).toHaveAttribute('href', 'mailto:kontakt@kuldev.pl');
  });
});
