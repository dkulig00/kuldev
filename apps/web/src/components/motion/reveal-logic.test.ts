import { afterEach, describe, expect, it } from 'vitest';
import { shouldArmReveal } from './reveal-logic';

function renderPage() {
  document.body.innerHTML = `
    <section id="kontakt">
      <div id="reveal"><a id="mail" href="mailto:kontakt@kuldev.pl">Mail</a></div>
    </section>
    <section id="inna-sekcja"></section>
  `;

  return document.getElementById('reveal') as HTMLElement;
}

const belowViewport = {
  top: 900,
  viewportHeight: 800,
  hash: '',
  reducedMotion: false,
};

describe('shouldArmReveal', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('arms an element below the viewport', () => {
    const element = renderPage();

    expect(shouldArmReveal({ ...belowViewport, element })).toBe(true);
  });

  it('does not arm an element inside the viewport', () => {
    const element = renderPage();

    expect(shouldArmReveal({ ...belowViewport, element, top: 400 })).toBe(
      false,
    );
  });

  it('does not arm an element above the viewport', () => {
    const element = renderPage();

    expect(shouldArmReveal({ ...belowViewport, element, top: -300 })).toBe(
      false,
    );
  });

  it('does not arm when the user prefers reduced motion', () => {
    const element = renderPage();

    expect(
      shouldArmReveal({ ...belowViewport, element, reducedMotion: true }),
    ).toBe(false);
  });

  it.each(['#kontakt', '#reveal', '#mail'])(
    'does not arm when the hash %s links to the element, an ancestor or a descendant',
    (hash) => {
      const element = renderPage();

      expect(shouldArmReveal({ ...belowViewport, element, hash })).toBe(false);
    },
  );

  it.each(['#inna-sekcja', '#nie-istnieje', '#%E0'])(
    'arms when the hash %s points elsewhere, nowhere or is malformed',
    (hash) => {
      const element = renderPage();

      expect(shouldArmReveal({ ...belowViewport, element, hash })).toBe(true);
    },
  );
});
