import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import pl from '../../messages/pl.json';
import { Hero } from './Hero';

describe('Hero', () => {
  afterEach(cleanup);

  it.each([
    ['pl', pl.hero],
    ['en', en.hero],
  ])('renders the %s eyebrow, title, subtitle and services link', (_, hero) => {
    render(
      <Hero
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
        servicesLabel={hero.servicesCta}
        servicesHref="#uslugi"
      />,
    );

    expect(screen.getByText(hero.eyebrow)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: hero.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(hero.subtitle)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: hero.servicesCta }),
    ).toHaveAttribute('href', '#uslugi');
  });

  it('has only the services link, no quote CTA', () => {
    render(
      <Hero
        eyebrow={pl.hero.eyebrow}
        title={pl.hero.title}
        subtitle={pl.hero.subtitle}
        servicesLabel={pl.hero.servicesCta}
        servicesHref="#uslugi"
      />,
    );

    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(
      screen.queryByRole('link', { name: pl.hero.cta }),
    ).not.toBeInTheDocument();
  });
});
