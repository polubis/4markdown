import { defineConfig } from 'cypress';
import { initPlugin } from '@frsource/cypress-plugin-visual-regression-diff/plugins';

export default defineConfig({
  e2e: {
    baseUrl: `http://localhost:8000`,
    specPattern: `cypress/e2e`,
    setupNodeEvents(on, config) {
      initPlugin(on, config);
    },
  },
});
