import { defineConfig } from 'cypress';
import { addMatchImageSnapshotPlugin } from 'cypress-image-snapshot/plugin';

export default defineConfig({
  e2e: {
    baseUrl: `http://localhost:9000`,
    defaultBrowser: `chrome`,
    specPattern: `cypress/e2e`,
    setupNodeEvents(on, config) {
      console.log(`siema` + config.env.failureThreshold);
      addMatchImageSnapshotPlugin(on, config);
      return config;
    },
    defaultCommandTimeout: 15000,
  },
  viewportWidth: 1000,
  viewportHeight: 625,
});
