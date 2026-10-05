import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { DevFeedbackOverlay } from './DevFeedbackOverlay';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal(
    this: HTMLDialogElement,
  ) {
    this.setAttribute('open', '');
  };
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

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

function openDialogWithComment(text: string) {
  document.body.innerHTML = `
    <section data-component="Hero" data-component-file="src/components/Hero.tsx">
      <a id="cta" href="#kontakt">Wyceń</a>
    </section>`;
  render(<DevFeedbackOverlay />);
  fireEvent.keyDown(document, { key: '.', ctrlKey: true });
  fireEvent.click(document.getElementById('cta')!);
  fireEvent.change(screen.getByRole('textbox', { name: 'Komentarz' }), {
    target: { value: text },
  });
}

describe('submit', () => {
  it('posts the payload as JSON and closes the dialog on success', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    openDialogWithComment('Za mały tekst');

    fireEvent.click(screen.getByRole('button', { name: 'Wyślij' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/dev-feedback');
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(init.body)).toMatchObject({
      componentName: 'Hero',
      componentFile: 'src/components/Hero.tsx',
      comment: 'Za mały tekst',
    });
  });

  it('keeps the dialog and the comment when the request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
    );
    openDialogWithComment('Zostaw mnie');

    fireEvent.click(screen.getByRole('button', { name: 'Wyślij' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Nie udało się wysłać',
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Komentarz' })).toHaveValue(
      'Zostaw mnie',
    );
  });
});
