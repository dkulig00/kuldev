import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { DevFeedbackOverlay } from './DevFeedbackOverlay';

afterEach(cleanup);

describe('DevFeedbackOverlay', () => {
  it('toggles inspection with the button', () => {
    render(<DevFeedbackOverlay />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('toggles inspection with Ctrl+.', () => {
    render(<DevFeedbackOverlay />);
    const button = screen.getByRole('button');

    fireEvent.keyDown(document, { key: '.', ctrlKey: true });

    expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});

it('highlights the nearest tagged component under the pointer', () => {
  document.body.innerHTML = `
      <section data-component="Hero">
        <h1 id="title">Tytuł</h1>
      </section>`;
  document.elementFromPoint = () => document.getElementById('title');

  render(<DevFeedbackOverlay />);
  fireEvent.keyDown(document, { key: '.', ctrlKey: true });
  fireEvent.pointerMove(document, { clientX: 10, clientY: 10 });

  expect(screen.getByText('Hero')).toBeInTheDocument();
});
