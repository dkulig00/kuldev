import { defineConfig } from '@playwright/test';
import base from './playwright.config';

// Runs only the dev feedback save spec, against `pnpm dev`, in one browser.
export default defineConfig({
  ...base,
  testIgnore: [],
  testMatch: ['dev-feedback-save.spec.ts'],
  projects: base.projects?.filter(
    (project) => project.name === 'Desktop Chrome',
  ),
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      SITE_URL: 'http://localhost:3000',
    },
  },
});
