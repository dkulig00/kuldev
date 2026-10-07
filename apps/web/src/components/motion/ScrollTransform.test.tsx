import { cleanup, render, screen } from '@testing-library/react';
import { LazyMotion, useReducedMotion } from 'motion/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ScrollTransform } from './ScrollTransform';

vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('motion/react')>()),
  useReducedMotion: vi.fn(() => false),
}));

const featuresThatNeverLoad = () => new Promise<never>(() => {});

function renderFader() {
  return (
    <LazyMotion features={featuresThatNeverLoad} strict>
      <ScrollTransform from={{ y: '85%' }} to={{ y: '25%' }}>
        <span>knob</span>
      </ScrollTransform>
    </LazyMotion>
  );
}

function placeElementAt(top: number) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    top,
  } as DOMRect);
}

function wrapper() {
  return screen.getByText('knob').parentElement;
}

describe('ScrollTransform', () => {
  beforeEach(() => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('server-renders the end state, never the start state', () => {
    const html = renderToString(renderFader());

    expect(html).toContain('data-scroll="static"');
    expect(html).toContain('25%');
    expect(html).not.toContain('85%');
  });

  it('activates an element that starts below the viewport', () => {
    placeElementAt(2000);

    render(renderFader());

    expect(wrapper()).toHaveAttribute('data-scroll', 'active');
  });

  it('moves an activated element to its start state at once', () => {
    placeElementAt(2000);

    render(renderFader());

    expect(wrapper()?.style.transform).toContain('translateY(85%)');
  });

  it('keeps a static element in its end state', () => {
    placeElementAt(100);

    render(renderFader());

    expect(wrapper()?.style.transform).toContain('translateY(25%)');
  });

  it('keeps an element inside the viewport static', () => {
    placeElementAt(100);

    render(renderFader());

    expect(wrapper()).toHaveAttribute('data-scroll', 'static');
  });

  it('stays static when the user prefers reduced motion', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    placeElementAt(2000);

    render(renderFader());

    expect(wrapper()).toHaveAttribute('data-scroll', 'static');
  });

  it.each([
    ['static', 100],
    ['active', 2000],
  ])('is hidden from assistive technology when %s', (_, top) => {
    placeElementAt(top);

    render(renderFader());

    expect(wrapper()).toHaveAttribute('aria-hidden', 'true');
  });
});
