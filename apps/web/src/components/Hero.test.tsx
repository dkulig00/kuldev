import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import pl from '../../messages/pl.json';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders the title, subtitle and CTA with the given href', () => {
    render(
      <Hero
        title="Tytuł"
        subtitle="Podtytuł"
        ctaLabel="Wyceń projekt"
        ctaHref="#kontakt"
      />,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Tytuł' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Podtytuł')).toBeInTheDocument();

    const cta = screen.getByRole('link', { name: 'Wyceń projekt' });
    expect(cta).toHaveAttribute('href', '#kontakt');
  });

  it.each([
    ['pl', pl.hero, 'Automatyzacje. AI first'],
    ['en', en.hero, 'Automations. AI first'],
  ])('renders the %s hero title from messages', (_locale, hero, title) => {
    render(
      <Hero
        title={hero.title}
        subtitle={hero.subtitle}
        ctaLabel={hero.cta}
        ctaHref="#kontakt"
      />,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: title }),
    ).toBeInTheDocument();
  });
});
