import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { DevFeedbackOverlay } from './DevFeedbackOverlay';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal(
    this: HTMLDialogElement,
  ) {
    this.setAttribute('open', '');
  };
});

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

describe('click capture', () => {
  it('opens the dialog for the clicked component and blocks the page action', () => {
    document.body.innerHTML = `
      <section data-component="Hero" data-component-file="src/components/Hero.tsx">
        <a id="cta" href="#kontakt">Wyceń</a>
      </section>`;
    render(<DevFeedbackOverlay />);
    fireEvent.keyDown(document, { key: '.', ctrlKey: true });

    const notPrevented = fireEvent.click(document.getElementById('cta')!);

    expect(notPrevented).toBe(false);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Hero')).toBeInTheDocument();
  });

  it('closes the dialog on Escape', () => {
    document.body.innerHTML = '<p id="p">tekst</p>';
    render(<DevFeedbackOverlay />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('lets clicks on the overlay button through without opening the dialog', () => {
    render(<DevFeedbackOverlay />);
    fireEvent.keyDown(document, { key: '.', ctrlKey: true });

    fireEvent.click(screen.getByRole('button'));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });
});
