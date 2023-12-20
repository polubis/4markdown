import { defineConfig } from 'cypress';
import { addMatchImageSnapshotPlugin } from 'cypress-image-snapshot/plugin';
import { config } from 'dotenv';

config();

export default defineConfig({
  e2e: {
    baseUrl: `http://localhost:8000`,
    specPattern: `cypress/e2e`,
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config);
      return config;
    },
  },
  env: {
    GOOGLE_REDIRECTION_KEY: process.env.GOOGLE_REDIRECTION_KEY,
  },
});
