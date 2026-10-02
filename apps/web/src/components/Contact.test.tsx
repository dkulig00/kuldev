import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Contact } from './Contact';

describe('Contact', () => {
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
});
