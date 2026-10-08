import { THEME_STORAGE_KEY } from './storage';

// Runs inline in <head> before the first paint, so it must be plain ES5
// without imports. It applies a stored theme choice (without one, CSS
// follows prefers-color-scheme) and marks that JavaScript is running.
export const themeScript = `(function () {
  var root = document.documentElement;
  root.dataset.js = '';
  try {
    var theme = localStorage.getItem('${THEME_STORAGE_KEY}');
    if (theme === 'light' || theme === 'dark') {
      root.dataset.theme = theme;
    }
  } catch (error) {}
})();`;
