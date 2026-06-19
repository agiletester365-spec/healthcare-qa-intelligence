import { defineConfig } from 'cypress';

// Plain ESM config (not .ts): with `"type": "module"` in package.json, a .ts config forces
// Cypress down the ts-node ESM path, which Node 20's require(esm) loader can't transpile
// ("Unexpected token ':'" in CI). Keeping the config typeless sidesteps that entirely;
// specs and support files are still TypeScript and handled by Cypress's spec preprocessor.
const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:4300';

export default defineConfig({
  e2e: {
    baseUrl: BASE_URL,
    specPattern: 'cypress/e2e/**/*.cy.{ts,js}',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000,
    viewportWidth: 1280,
    viewportHeight: 800,
    retries: { runMode: 2, openMode: 0 },
    env: {
      TEST_DATA_SEED: process.env.TEST_DATA_SEED ?? '20260619',
    },
    setupNodeEvents(on) {
      // Lets specs log self-healing / a11y events to the terminal via cy.task('log', ...).
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
  },
});
