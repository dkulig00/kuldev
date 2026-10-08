'use client';

import { devComponentProps } from '@/lib/dev-feedback/component-tag';
import {
  applyTheme,
  currentTheme,
  subscribeToTheme,
} from '@/lib/theme/storage';
import { useSyncExternalStore } from 'react';

interface ThemeToggleProps {
  label: string;
}

// The server cannot know the visitor's theme.
const serverSnapshot = () => null;

export function ThemeToggle({ label }: Readonly<ThemeToggleProps>) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    currentTheme,
    serverSnapshot,
  );
  const isDark = theme === 'dark';

  return (
    <button
      {...devComponentProps('ThemeToggle', 'src/components/ThemeToggle.tsx')}
      type="button"
      aria-label={label}
      aria-pressed={theme === null ? undefined : isDark}
      onClick={() => applyTheme(isDark ? 'light' : 'dark')}
      className="text-ink hover:bg-surface focus-visible:outline-accent-text inline-flex size-11 items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5">
        <circle
          cx="10"
          cy="10"
          r="7.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M10 2.75a7.25 7.25 0 0 0 0 14.5z" fill="currentColor" />
      </svg>
    </button>
  );
}
