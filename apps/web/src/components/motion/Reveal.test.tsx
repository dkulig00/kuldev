import { cleanup, render, screen } from '@testing-library/react';
import { LazyMotion, useReducedMotion } from 'motion/react';
import { ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Reveal } from './Reveal';

vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('motion/react')>()),
  useReducedMotion: vi.fn(() => false),
}));

const featuresThatNeverLoad = () => new Promise<never>(() => {});

function withLazyMotion(children: ReactNode) {
  return (
    <LazyMotion features={featuresThatNeverLoad} strict>
      {children}
    </LazyMotion>
  );
}

function placeElementAt(top: number) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    top,
  } as DOMRect);
}

function revealWrapper() {
  return screen.getByText('Kontakt').parentElement;
}

describe('Reveal', () => {
  beforeEach(() => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('server-renders visible content without a hidden state', () => {
    const html = renderToString(
      withLazyMotion(
        <Reveal>
          <p>Kontakt</p>
        </Reveal>,
      ),
    );

    expect(html).toContain('Kontakt');
    expect(html).toContain('data-reveal="static"');
    expect(html).not.toMatch(/opacity:\s*0/);
  });

  it('arms an element that starts below the viewport', () => {
    placeElementAt(2000);

    render(
      withLazyMotion(
        <Reveal>
          <p>Kontakt</p>
        </Reveal>,
      ),
    );

    expect(revealWrapper()).toHaveAttribute('data-reveal', 'armed');
  });

  it('keeps an element inside the viewport static', () => {
    placeElementAt(100);

    render(
      withLazyMotion(
        <Reveal>
          <p>Kontakt</p>
        </Reveal>,
      ),
    );

    expect(revealWrapper()).toHaveAttribute('data-reveal', 'static');
  });

  it('stays static when the user prefers reduced motion', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    placeElementAt(2000);

    render(
      withLazyMotion(
        <Reveal>
          <p>Kontakt</p>
        </Reveal>,
      ),
    );

    expect(revealWrapper()).toHaveAttribute('data-reveal', 'static');
  });

  it('never hides content when the animation features fail to load', () => {
    placeElementAt(2000);

    render(
      withLazyMotion(
        <Reveal>
          <p>Kontakt</p>
        </Reveal>,
      ),
    );

    expect(revealWrapper()).toHaveAttribute('data-reveal', 'armed');
    expect(revealWrapper()).not.toHaveStyle({ opacity: '0' });
  });
});
