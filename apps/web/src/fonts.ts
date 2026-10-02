import localFont from 'next/font/local';

export const headlineFont = localFont({
  src: [
    {
      path: './fonts/big-shoulders/big-shoulders-600.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/big-shoulders/big-shoulders-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-big-shoulders',
});

export const bodyFont = localFont({
  src: [
    {
      path: './fonts/ibm-plex-sans/ibm-plex-sans-400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/ibm-plex-sans/ibm-plex-sans-500.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/ibm-plex-sans/ibm-plex-sans-600.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-plex-sans',
});

export const monoFont = localFont({
  src: [
    {
      path: './fonts/ibm-plex-mono/ibm-plex-mono-400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/ibm-plex-mono/ibm-plex-mono-500.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-plex-mono',
});
