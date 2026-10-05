import { afterEach, describe, expect, it } from 'vitest';
import {
  buildSelector,
  extractTextSnippet,
  findNearestComponent,
  isOverlayElement,
} from './dom-inspect';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('findNearestComponent', () => {
  it('returns the nearest tagged ancestor', () => {
    document.body.innerHTML = `
      <main>
        <section data-component="Hero" data-component-file="src/components/Hero.tsx">
          <h1><span id="title">Tytuł</span></h1>
        </section>
      </main>`;
    const span = document.getElementById('title')!;

    expect(findNearestComponent(span)?.getAttribute('data-component')).toBe(
      'Hero',
    );
  });

  it('returns null when no ancestor is tagged', () => {
    document.body.innerHTML = '<p id="plain">tekst</p>';

    expect(findNearestComponent(document.getElementById('plain')!)).toBeNull();
  });
});

describe('isOverlayElement', () => {
  it('is true for elements inside the overlay and false otherwise', () => {
    document.body.innerHTML = `
      <div data-dev-feedback-ui><button id="toggle">x</button></div>
      <p id="page">strona</p>`;

    expect(isOverlayElement(document.getElementById('toggle')!)).toBe(true);
    expect(isOverlayElement(document.getElementById('page')!)).toBe(false);
  });
});

describe('buildSelector', () => {
  it('builds a selector that points back to the same element', () => {
    document.body.innerHTML = `
      <main>
        <p>pierwszy</p>
        <p id="target">drugi</p>
      </main>`;
    const target = document.getElementById('target')!;
    const selector = buildSelector(target);

    expect(selector).toBe('body > main:nth-of-type(1) > p:nth-of-type(2)');
    expect(document.querySelector(selector)).toBe(target);
  });
});

describe('extractTextSnippet', () => {
  it('collapses whitespace and trims', () => {
    document.body.innerHTML = '<p id="p">  Ala \n  ma   kota  </p>';

    expect(extractTextSnippet(document.getElementById('p')!)).toBe(
      'Ala ma kota',
    );
  });

  it('cuts long text to 500 characters', () => {
    document.body.innerHTML = `<p id="p">${'a'.repeat(800)}</p>`;

    expect(extractTextSnippet(document.getElementById('p')!)).toHaveLength(500);
  });
});
