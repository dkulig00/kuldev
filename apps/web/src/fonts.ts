import localFont from 'next/font/local';

export const sansFont = localFont({
  src: './fonts/archivo/archivo-variable.woff2',
  weight: '400 600',
  style: 'normal',
  display: 'swap',
  variable: '--font-archivo',
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
