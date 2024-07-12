import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: `./e2e/specs`,
  use: {
    baseURL: process.env.BASE_URL,
    browserName: `chromium`,
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    ignoreHTTPSErrors: true,
  },
});
