const { defineConfig } = require('cypress');
const fs = require('node:fs');
const path = require('node:path');
const mochawesome = require('cypress-mochawesome-reporter/plugin');
const { plugin: registerGrep } = require('@cypress/grep/plugin');

/**
 * Load a per-environment config file from `cypress/config/<name>.json` and merge
 * it onto the base config. Select it at runtime with:
 *
 *   cypress run --env configFile=staging
 *
 * Falls back to `local` when nothing is passed.
 *
 * A file may contain three kinds of keys:
 *   - `expose` — non-sensitive values, readable in the browser via
 *     `Cypress.expose('key')` and shown in reports (apiUrl, environmentName…).
 *   - `env`    — sensitive values (tokens, passwords). Seeded into the secret
 *     store below; read in tests with `cy.getSecret([...])`.
 *   - anything else — merged at the top level, so a file can override `baseUrl`,
 *     `viewportWidth`, `retries`, timeouts, etc.
 */
function loadEnvConfig(config) {
  const name = config.env.configFile || 'local';
  const dir = path.resolve(__dirname, 'cypress', 'config');
  const file = path.join(dir, `${name}.json`);

  if (!fs.existsSync(file)) {
    throw new Error(
      `Environment config "${name}" not found. Expected a file at ${file}. ` +
        `Available: ${fs
          .readdirSync(dir)
          .filter((f) => f.endsWith('.json'))
          .map((f) => f.replace('.json', ''))
          .join(', ')}`,
    );
  }

  const loaded = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const { env: loadedEnv = {}, expose: loadedExpose = {}, ...rest } = loaded;

  return {
    ...config,
    ...rest,
    env: {
      ...config.env,
      ...loadedEnv,
      configFile: name,
    },
    expose: {
      ...config.expose,
      ...loadedExpose,
      environmentName: loadedExpose.environmentName ?? name,
      configFile: name,
    },
  };
}

module.exports = defineConfig({
  // Reporting: cypress-mochawesome-reporter combines every spec into one
  // self-contained HTML file at cypress/reports/index.html at the end of the run.
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'Cypress Framework Report',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },

  // Sane global defaults. Override per environment in cypress/config/*.json.
  video: false,
  screenshotOnRunFailure: true,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  viewportWidth: 1280,
  viewportHeight: 800,
  defaultCommandTimeout: 8000,
  requestTimeout: 12000,
  responseTimeout: 20000,
  watchForFileChanges: false,

  // Non-sensitive values, readable in the browser with `Cypress.expose('key')`.
  // @cypress/grep also reads its options from here; override per run with
  // `--expose`, e.g. `cypress run --expose grepTags=@smoke`.
  expose: {
    apiUrl: 'https://jsonplaceholder.typicode.com',
    environmentName: 'local',
    grepFilterSpecs: true,
    grepOmitFiltered: true,
  },

  // Sensitive values live here (or in cypress.env.json / CYPRESS_* vars) and are
  // never sent to the browser directly — tests read them with `cy.getSecret()`.
  env: {
    authToken: '',
    userEmail: '',
    userPassword: '',
  },

  e2e: {
    baseUrl: 'https://example.cypress.io',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/reports/screenshots',
    videosFolder: 'cypress/reports/videos',
    downloadsFolder: 'cypress/downloads',

    setupNodeEvents(on, config) {
      mochawesome(on);

      // In-memory secret store, seeded from `config.env`. Sensitive values never
      // reach the browser as plain config; tests pull only what they ask for via
      // `cy.getSecret([...])`, and write runtime values (a login token, say)
      // with `cy.setSecret({ ... })`.
      const secrets = { ...config.env };
      on('task', {
        'secret:get': (keys) =>
          Object.fromEntries((keys || []).map((k) => [k, secrets[k]])),
        'secret:set': (values) => {
          Object.assign(secrets, values || {});
          return null;
        },
        log: (message) => {
          console.log(message);
          return null;
        },
      });

      const merged = loadEnvConfig(config);
      // Re-seed with any secrets pulled in from the environment file.
      Object.assign(secrets, merged.env);
      registerGrep(merged);
      return merged;
    },
  },
});
