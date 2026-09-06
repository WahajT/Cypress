# Environments

The framework runs the same specs against many targets (local, staging,
production, a review app…) by swapping a small JSON file at launch.

## How it works

```
npx cypress run --env configFile=staging
                                  │
                                  ▼
        cypress/config/staging.json
                                  │  loadEnvConfig() in cypress.config.js
                                  ▼
   • top-level keys (baseUrl, retries, video…) override the defaults
   • keys under "expose" are merged into the public config (Cypress.expose)
   • keys under "env" are merged into the secret store (cy.getSecret)
   • Cypress.expose('configFile') is set to "staging"
```

If the named file doesn't exist, the run fails fast with a list of the files
that do.

## The files

| File                                                                  | Script                         | Typical use                                       |
| --------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------- |
| [`cypress/config/local.json`](../cypress/config/local.json)           | `npm run test:local` (default) | Your machine / `localhost`                        |
| [`cypress/config/staging.json`](../cypress/config/staging.json)       | `npm run test:staging`         | Pre-prod, run in CI on every PR                   |
| [`cypress/config/production.json`](../cypress/config/production.json) | `npm run test:production`      | Post-deploy smoke checks (video on, more retries) |

### Shape

```json
{
  "baseUrl": "https://staging.myapp.com",
  "retries": { "runMode": 2, "openMode": 0 },
  "expose": {
    "apiUrl": "https://api.staging.myapp.com",
    "environmentName": "staging"
  },
  "env": {}
}
```

- **`expose`** — non-sensitive, readable in tests via `Cypress.expose('key')`.
- **`env`** — sensitive; seeded into the secret store, read via
  `cy.getSecret([...])`. Leave it empty in the committed file and provide the
  real values at runtime (see [Secrets](#secrets)).
- Any other key (e.g. `baseUrl`, `retries`) overrides the base config.

## Adding an environment

1. Create `cypress/config/<name>.json`.
2. (Optional) add a script to `package.json`:
   ```json
   "test:<name>": "cypress run --env configFile=<name>"
   ```
3. Run it: `npx cypress run --env configFile=<name>`.

## Secrets

**Never put passwords, tokens, or API keys in the config files** — they are
committed. Provide them at runtime instead:

```bash
# Locally — cypress.env.json (git-ignored)
{ "userEmail": "…", "userPassword": "…" }

# CI — environment variables prefixed with CYPRESS_
CYPRESS_userPassword=***  npx cypress run --env configFile=staging
```

`CYPRESS_userPassword` is picked up into `config.env` and therefore into the
secret store, so `cy.getSecret(['userPassword'])` returns it.

## Reading the environment in a test

```js
it('runs against the expected target', () => {
  cy.log(`env: ${Cypress.expose('environmentName')}`);
  expect(Cypress.config('baseUrl')).to.include('staging');
});
```
