import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Contact } from './Contact';

describe('Contact', () => {
  afterEach(cleanup);

  it('renders heading, body and a mailto link anchored at #kontakt', () => {
    const { container } = render(
      <Contact
        heading="Kontakt"
        body="Opisz swój projekt"
        email="kontakt@kuldev.pl"
        emailLabel="Napisz e-mail"
      />,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Kontakt' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Opisz swój projekt')).toBeInTheDocument();

    const emailLink = screen.getByRole('link', { name: 'Napisz e-mail' });
    expect(emailLink).toHaveAttribute('href', 'mailto:kontakt@kuldev.pl');

    expect(container.querySelector('#kontakt')).not.toBeNull();
  });

  it('reveals its content on scroll but never the #kontakt anchor itself', () => {
    const { container } = render(
      <Contact
        heading="Kontakt"
        body="Opisz swój projekt"
        email="kontakt@kuldev.pl"
        emailLabel="Napisz e-mail"
      />,
    );

    const section = container.querySelector('#kontakt');
    const reveal = screen
      .getByRole('heading', { level: 2, name: 'Kontakt' })
      .closest('[data-reveal]');

    expect(reveal).not.toBeNull();
    expect(section).toContainElement(reveal as HTMLElement);
    expect(section).not.toHaveAttribute('data-reveal');
  });
});
