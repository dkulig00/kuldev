import { act, cleanup, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { THEME_STORAGE_KEY } from '@/lib/theme/storage';
import { ThemeToggle } from './ThemeToggle';

function stubSystemTheme(prefersLight: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: prefersLight,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

function toggle() {
  return screen.getByRole('button', { name: 'Ciemny motyw' });
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    stubSystemTheme(false);
  });

  afterEach(() => {
    cleanup();
    delete document.documentElement.dataset.theme;
    window.localStorage.clear();
    vi.unstubAllGlobals();
  });

  it('renders no pressed state on the server, where the theme is unknown', () => {
    const html = renderToString(<ThemeToggle label="Ciemny motyw" />);

    expect(html).toContain('aria-label="Ciemny motyw"');
    expect(html).not.toContain('aria-pressed');
  });

  it('is pressed when the system theme is dark', () => {
    render(<ThemeToggle label="Ciemny motyw" />);

    expect(toggle()).toHaveAttribute('aria-pressed', 'true');
  });

  it('is not pressed when the system theme is light', () => {
    stubSystemTheme(true);
    render(<ThemeToggle label="Ciemny motyw" />);

    expect(toggle()).toHaveAttribute('aria-pressed', 'false');
  });

  it('switches to light, stores the choice and updates its state', async () => {
    render(<ThemeToggle label="Ciemny motyw" />);

    await act(async () => {
      toggle().click();
    });

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(toggle()).toHaveAttribute('aria-pressed', 'false');
  });

  it('switches back to dark on a second click', async () => {
    document.documentElement.dataset.theme = 'light';
    render(<ThemeToggle label="Ciemny motyw" />);

    await act(async () => {
      toggle().click();
    });

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(toggle()).toHaveAttribute('aria-pressed', 'true');
  });
});
