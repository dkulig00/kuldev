import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import pl from '../../messages/pl.json';
import { About } from './About';

function renderAbout() {
  return render(
    <About
      heading={pl.about.heading}
      name={pl.about.name}
      role={pl.about.role}
      paragraphs={pl.about.paragraphs}
      principlesLabel={pl.about.principlesLabel}
      principles={pl.about.principles}
    />,
  );
}

describe('About', () => {
  afterEach(cleanup);

  it('renders a section anchored at #o-mnie and labelled by its heading', () => {
    renderAbout();

    expect(
      screen.getByRole('region', { name: pl.about.heading }),
    ).toHaveAttribute('id', 'o-mnie');
  });

  it('renders the name, role and every paragraph', () => {
    renderAbout();

    expect(screen.getByText(pl.about.name)).toBeInTheDocument();
    expect(screen.getByText(pl.about.role)).toBeInTheDocument();
    pl.about.paragraphs.forEach((paragraph) => {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    });
  });

  it('shows initials as a decorative monogram hidden from screen readers', () => {
    renderAbout();

    expect(
      screen.getByText('DK').closest('[aria-hidden="true"]'),
    ).not.toBeNull();
  });

  it('lists the principles under their own heading', () => {
    renderAbout();

    expect(
      screen.getByRole('heading', { level: 3, name: pl.about.principlesLabel }),
    ).toBeInTheDocument();

    const items = within(screen.getAllByRole('list')[0]).getAllByRole(
      'listitem',
    );
    expect(items).toHaveLength(pl.about.principles.length);
    pl.about.principles.forEach((principle, index) => {
      expect(
        within(items[index]).getByText(principle.title),
      ).toBeInTheDocument();
      expect(
        within(items[index]).getByText(principle.description),
      ).toBeInTheDocument();
    });
  });
});
