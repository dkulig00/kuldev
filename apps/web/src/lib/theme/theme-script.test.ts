import { afterEach, describe, expect, it, vi } from 'vitest';
import { THEME_STORAGE_KEY } from './storage';
import { themeScript } from './theme-script';

function runThemeScript() {
  // The script is shipped as a string and executed by the browser as is,
  // so the test executes exactly the same text.
  new Function(themeScript)();
}

describe('themeScript', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.js;
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('marks that JavaScript is running', () => {
    runThemeScript();

    expect(document.documentElement.hasAttribute('data-js')).toBe(true);
  });

  it('applies a stored theme choice', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');

    runThemeScript();

    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('leaves the theme to CSS without a stored choice', () => {
    runThemeScript();

    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('ignores an unknown stored value', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'neon');

    runThemeScript();

    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('does not throw and still marks JavaScript when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(runThemeScript).not.toThrow();
    expect(document.documentElement.hasAttribute('data-js')).toBe(true);
  });
});
