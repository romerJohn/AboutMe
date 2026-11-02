export type Theme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'kai_portfolio_theme';

/**
 * Loads the active theme from localStorage or system preferences safely
 */
export function loadSavedTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    // Respect system preference if not explicitly stored
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  } catch {
    return 'dark';
  }
}

/**
 * Applies the theme class ('dark' | 'light') to document.documentElement
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.remove('dark');
    root.classList.add('light');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
  }
}

/**
 * Persists the chosen theme to localStorage safely
 */
export function persistTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Toggles theme between dark and light
 */
export function getOppositeTheme(current: Theme): Theme {
  return current === 'dark' ? 'light' : 'dark';
}
