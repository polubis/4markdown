import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: `./e2e/specs`,
  use: {
    baseURL: `http://localhost:8000`,
    browserName: `chromium`,
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    ignoreHTTPSErrors: true,
  },
});
