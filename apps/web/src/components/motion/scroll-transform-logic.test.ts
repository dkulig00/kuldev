import { afterEach, describe, expect, it } from 'vitest';
import { shouldActivateScrollTransform } from './scroll-transform-logic';

function renderPage() {
  document.body.innerHTML = `
    <section id="uslugi">
      <div id="fader"><span id="knob"></span></div>
    </section>
    <section id="kontakt"></section>
  `;

  return document.getElementById('fader') as HTMLElement;
}

const belowViewport = {
  top: 900,
  viewportHeight: 800,
  hash: '',
  reducedMotion: false,
};

describe('shouldActivateScrollTransform', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('activates an element below the viewport', () => {
    const element = renderPage();

    expect(shouldActivateScrollTransform({ ...belowViewport, element })).toBe(
      true,
    );
  });

  it.each([
    ['inside', 400],
    ['above', -300],
  ])('stays static for an element %s the viewport', (_, top) => {
    const element = renderPage();

    expect(
      shouldActivateScrollTransform({ ...belowViewport, element, top }),
    ).toBe(false);
  });

  it('stays static when the user prefers reduced motion', () => {
    const element = renderPage();

    expect(
      shouldActivateScrollTransform({
        ...belowViewport,
        element,
        reducedMotion: true,
      }),
    ).toBe(false);
  });

  it.each(['#uslugi', '#fader', '#knob'])(
    'stays static when the hash %s links to the element, an ancestor or a descendant',
    (hash) => {
      const element = renderPage();

      expect(
        shouldActivateScrollTransform({ ...belowViewport, element, hash }),
      ).toBe(false);
    },
  );

  it.each(['#kontakt', '#nie-istnieje', '#%E0'])(
    'activates when the hash %s points elsewhere, nowhere or is malformed',
    (hash) => {
      const element = renderPage();

      expect(
        shouldActivateScrollTransform({ ...belowViewport, element, hash }),
      ).toBe(true);
    },
  );
});
