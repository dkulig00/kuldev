export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'kuldev-theme';

const LIGHT_QUERY = '(prefers-color-scheme: light)';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

export function readStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);

    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

export function currentTheme(): Theme {
  const applied = document.documentElement.dataset.theme;

  if (isTheme(applied)) {
    return applied;
  }

  return window.matchMedia(LIGHT_QUERY).matches ? 'light' : 'dark';
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked (private mode, disabled cookies); the choice
    // then lasts until the page is reloaded.
  }
}

export function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  const media = window.matchMedia(LIGHT_QUERY);
  media.addEventListener('change', onChange);

  return () => {
    observer.disconnect();
    media.removeEventListener('change', onChange);
  };
}
