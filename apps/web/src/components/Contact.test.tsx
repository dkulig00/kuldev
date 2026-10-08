import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Contact } from './Contact';

const paths = [
  {
    id: 'short',
    title: 'Krótka wiadomość',
    description: 'Kilka zdań',
    ctaLabel: 'Napisz krótką wiadomość',
    href: 'mailto:kontakt@kuldev.pl?subject=Zapytanie',
  },
  {
    id: 'brief',
    title: 'Pełny brief',
    description: 'Gotowe pytania',
    ctaLabel: 'Wyślij pełny brief',
    href: 'mailto:kontakt@kuldev.pl?subject=Brief&body=Cel%3A',
  },
];

function renderContact() {
  return render(
    <Contact
      heading="Porozmawiajmy"
      body="Wybierz, jak chcesz zacząć."
      paths={paths}
    />,
  );
}

describe('Contact', () => {
  afterEach(cleanup);

  it('renders a section anchored at #kontakt and labelled by its heading', () => {
    renderContact();

    const section = screen.getByRole('region', { name: 'Porozmawiajmy' });
    expect(section).toHaveAttribute('id', 'kontakt');
    expect(screen.getByText('Wybierz, jak chcesz zacząć.')).toBeInTheDocument();
  });

  it('renders each path with its own heading and mailto link', () => {
    renderContact();

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);

    paths.forEach((path, index) => {
      const item = within(items[index]);

      expect(
        item.getByRole('heading', { level: 3, name: path.title }),
      ).toBeInTheDocument();
      expect(item.getByText(path.description)).toBeInTheDocument();
      expect(item.getByRole('link', { name: path.ctaLabel })).toHaveAttribute(
        'href',
        path.href,
      );
    });
  });

  it('gives the two links distinct accessible names', () => {
    renderContact();

    const names = screen.getAllByRole('link').map((link) => link.textContent);

    expect(new Set(names).size).toBe(names.length);
  });

  it('reveals its content on scroll but never the #kontakt anchor itself', () => {
    const { container } = renderContact();

    const section = container.querySelector('#kontakt');
    const reveal = screen
      .getByRole('heading', { level: 2, name: 'Porozmawiajmy' })
      .closest('[data-reveal]');

    expect(reveal).not.toBeNull();
    expect(section).toContainElement(reveal as HTMLElement);
    expect(section).not.toHaveAttribute('data-reveal');
  });
});
