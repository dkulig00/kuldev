import { Big_Shoulders, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';

export const headlineFont = Big_Shoulders({
  weight: ['600', '700'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-big-shoulders',
});

export const bodyFont = IBM_Plex_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-plex-sans',
});

export const monoFont = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-plex-mono',
});
