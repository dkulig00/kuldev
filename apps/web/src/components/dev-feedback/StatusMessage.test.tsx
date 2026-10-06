import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { StatusMessage } from './StatusMessage';

afterEach(cleanup);

describe('StatusMessage', () => {
  it('announces the message as a status', () => {
    render(<StatusMessage variant="success">Zapisano uwagę</StatusMessage>);

    expect(screen.getByRole('status')).toHaveTextContent('Zapisano uwagę');
  });

  it('uses the success colour for the success variant', () => {
    render(<StatusMessage variant="success">Zapisano uwagę</StatusMessage>);

    expect(screen.getByRole('status')).toHaveClass('text-green-700');
  });

  it('uses the error colour for the error variant', () => {
    render(<StatusMessage variant="error">Nie udało się wysłać</StatusMessage>);

    expect(screen.getByRole('status')).toHaveClass('text-red-700');
  });

  it('hides the decorative icon from assistive technology', () => {
    const { container } = render(
      <StatusMessage variant="success">OK</StatusMessage>,
    );

    expect(container.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});
