import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyTheme,
  currentTheme,
  isTheme,
  readStoredTheme,
  subscribeToTheme,
  THEME_STORAGE_KEY,
} from './storage';

type MediaListener = () => void;

function stubSystemTheme(prefersLight: boolean) {
  const listeners = new Set<MediaListener>();
  const media = {
    matches: prefersLight,
    addEventListener: vi.fn((_: string, listener: MediaListener) => {
      listeners.add(listener);
    }),
    removeEventListener: vi.fn((_: string, listener: MediaListener) => {
      listeners.delete(listener);
    }),
  };

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => media),
  );

  return {
    media,
    change: () => listeners.forEach((listener) => listener()),
  };
}

function blockStorage() {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('blocked');
  });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('blocked');
  });
}

describe('theme storage', () => {
  beforeEach(() => {
    stubSystemTheme(false);
  });

  afterEach(() => {
    delete document.documentElement.dataset.theme;
    window.localStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('accepts only light and dark as themes', () => {
    expect(isTheme('light')).toBe(true);
    expect(isTheme('dark')).toBe(true);
    expect(isTheme('system')).toBe(false);
    expect(isTheme(null)).toBe(false);
  });

  it('reads a stored theme and ignores unknown values', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
    expect(readStoredTheme()).toBe('light');

    window.localStorage.setItem(THEME_STORAGE_KEY, 'neon');
    expect(readStoredTheme()).toBeNull();
  });

  it('returns null when storage is blocked', () => {
    blockStorage();

    expect(readStoredTheme()).toBeNull();
  });

  it('prefers the applied theme over the system setting', () => {
    stubSystemTheme(true);
    document.documentElement.dataset.theme = 'dark';

    expect(currentTheme()).toBe('dark');
  });

  it('falls back to the system setting without an applied theme', () => {
    stubSystemTheme(true);
    expect(currentTheme()).toBe('light');

    stubSystemTheme(false);
    expect(currentTheme()).toBe('dark');
  });

  it('applies and stores the chosen theme', () => {
    applyTheme('light');

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('still applies the theme when storage is blocked', () => {
    blockStorage();

    expect(() => applyTheme('light')).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('notifies about attribute and system changes until unsubscribed', async () => {
    const system = stubSystemTheme(false);
    const onChange = vi.fn();
    const unsubscribe = subscribeToTheme(onChange);

    document.documentElement.dataset.theme = 'light';
    // MutationObserver callbacks run as a microtask.
    await Promise.resolve();
    expect(onChange).toHaveBeenCalledTimes(1);

    system.change();
    expect(onChange).toHaveBeenCalledTimes(2);

    unsubscribe();
    document.documentElement.dataset.theme = 'dark';
    await Promise.resolve();
    system.change();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(system.media.removeEventListener).toHaveBeenCalled();
  });
});
