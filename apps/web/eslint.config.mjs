import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

const fontImportRestriction = {
  name: 'next/font/google',
  message:
    'Fonts are self-hosted via next/font/local (see docs/decisions/0005-self-host-fonts.md). Add new font files under src/fonts/ instead.',
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [fontImportRestriction],
          patterns: [
            {
              regex: '^(framer-)?motion(/.*)?$',
              message:
                'Animations live in src/components/motion/ (see docs/decisions/0008-motion-foundation.md). Use a primitive from @/components/motion instead.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/components/motion/**'],
    rules: {
      'no-restricted-imports': ['error', { paths: [fontImportRestriction] }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
