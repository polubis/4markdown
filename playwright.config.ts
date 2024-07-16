import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: `./e2e/specs`,
  snapshotDir: `./e2e/snapshots`,
  use: {
    baseURL: `http://localhost:8000`,
    browserName: `chromium`,
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 2000,
    ignoreHTTPSErrors: true,
  },
});
