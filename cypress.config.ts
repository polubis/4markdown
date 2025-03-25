import { defineConfig } from 'cypress';
import { addMatchImageSnapshotPlugin } from 'cypress-image-snapshot/plugin';

export default defineConfig({
  e2e: {
    defaultBrowser: `chrome`,
    specPattern: `cypress/e2e`,
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config);

      on(`before:browser:launch`, (browser, launchOptions) => {
        if (browser.name === `chrome` || browser.name === `chromium`) {
          launchOptions.args.push(`--color-profile=srgb`);
          launchOptions.args.push(`--force-color-profile=srgb`);
          launchOptions.args.push(`--color-depth=24`);
        }
        return launchOptions;
      });

      return config;
    },
    defaultCommandTimeout: 15000,
    viewportWidth: 1000,
    viewportHeight: 625,
  },
});
