# Configuration

All Cypress configuration lives in [`cypress.config.js`](../cypress.config.js).
There is no second config file to hunt through.

## Layers, lowest priority first

1. **Defaults in `cypress.config.js`** — `retries`, timeouts, viewport, reporter,
   `e2e.baseUrl`, the `expose` block, the `env` block.
2. **Environment file** — `cypress/config/<name>.json`, selected with
   `--env configFile=<name>` (defaults to `local`). Merged by `loadEnvConfig()`
   in `cypress.config.js`. See [environments.md](environments.md).
3. **`cypress.env.json`** (git-ignored) — your personal machine secrets.
4. **`CYPRESS_*` OS environment variables** — e.g. `CYPRESS_userPassword`. Used
   in CI for secrets.
5. **`--env`, `--expose`, `--config` on the CLI** — highest priority.

## Cypress 16: `Cypress.env()` is gone

Cypress 16 removed `Cypress.env()` and split configuration into two channels:

| Channel    | Config key      | Read in a test with                        | For                                                                                                                                           |
| ---------- | --------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Public** | `expose: { … }` | `Cypress.expose('key')` — synchronous      | Non-sensitive values: `apiUrl`, `environmentName`, feature flags. Visible in the report and DevTools. Also how `@cypress/grep` is configured. |
| **Secret** | `env: { … }`    | `cy.getSecret(['key'])` — async, `.then()` | Tokens, passwords. Held in a Node-side store; only the keys a test asks for cross into the browser.                                           |

`cy.getSecret` / `cy.setSecret` are framework commands
([`cypress/support/commands/env.js`](../cypress/support/commands/env.js)) backed
by the `secret:get` / `secret:set` tasks in `cypress.config.js`. The store is
seeded from `env` at startup and from the loaded environment file; tests can add
runtime values (e.g. a login token) with `cy.setSecret({ authToken })`.

Cypress's own built-in `cy.env(['key'])` also works for statically-configured
secrets; the framework uses the task store so the same command covers values
written mid-run.

## Key settings and why they're set

| Setting                              | Value                                 | Reason                                                                                |
| ------------------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------- |
| `retries.runMode`                    | `2`                                   | Absorb infra blips in CI; `0` in `openMode` for fast feedback                         |
| `video`                              | `false`                               | Faster runs; screenshots on failure are usually enough. `production.json` turns it on |
| `screenshotOnRunFailure`             | `true`                                | Attached to the HTML report                                                           |
| `defaultCommandTimeout`              | `8000`                                | A little more headroom than the 4s default for slower apps                            |
| `requestTimeout` / `responseTimeout` | `12000` / `20000`                     | API specs hit real services                                                           |
| `watchForFileChanges`                | `false`                               | Avoid surprise re-runs in `cy:open`; flip locally if you like                         |
| `e2e.specPattern`                    | `cypress/e2e/**/*.cy.{js,jsx,ts,tsx}` | TS specs work without extra config once you add `typescript`                          |
| `screenshotsFolder` / `videosFolder` | under `cypress/reports/`              | One place for CI to upload                                                            |

## Values the framework reads

| Key                                    | Channel | Set in                                             | Purpose                                                |
| -------------------------------------- | ------- | -------------------------------------------------- | ------------------------------------------------------ |
| `apiUrl`                               | expose  | `cypress.config.js` / config files                 | Base URL for `cy.api()`                                |
| `environmentName`                      | expose  | config files (defaults to the file name)           | Human label for the current target                     |
| `configFile`                           | both    | injected by `loadEnvConfig()`                      | Which env file loaded                                  |
| `grepFilterSpecs` / `grepOmitFiltered` | expose  | `cypress.config.js`                                | `@cypress/grep` behaviour                              |
| `grepTags` / `grep`                    | expose  | CLI `--expose`                                     | Test filtering                                         |
| `authToken`                            | secret  | `cy.apiLogin()` at runtime, or `CYPRESS_authToken` | Bearer token for `cy.api()`                            |
| `userEmail` / `userPassword`           | secret  | `cypress.env.json` or `CYPRESS_*`                  | Default credentials for `cy.login()` / `cy.apiLogin()` |

### Example `cypress.env.json` (do not commit)

```json
{
  "userEmail": "me@example.test",
  "userPassword": "localdevpassword"
}
```

## Overriding config per spec

```js
describe('mobile viewport', { viewportWidth: 375, viewportHeight: 667 }, () => {
  // …
});

it('slow endpoint', { defaultCommandTimeout: 20000 }, () => {
  // …
});
```

## TypeScript (optional)

```bash
npm i -D typescript
```

Add a `tsconfig.json`, rename specs/pages to `.ts`, and set `sourceType`
accordingly in `eslint.config.mjs`. `specPattern` already includes `.ts`/`.tsx`.
