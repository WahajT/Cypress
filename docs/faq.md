# FAQ & troubleshooting

### `npm install` fails downloading the Cypress binary

Behind a proxy or firewall, set `CYPRESS_DOWNLOAD_MIRROR` or install from a
cached binary with `CYPRESS_INSTALL_BINARY=/path/to/cypress.zip`. See the
[Cypress install docs](https://docs.cypress.io/app/references/advanced-installation).

### `cypress verify` fails on Linux with missing libraries

Install the OS packages listed in the
[Cypress system requirements](https://docs.cypress.io/app/get-started/install-cypress#Linux-Prerequisites),
or use the `cypress/browsers` Docker image.

### Tests pass locally but fail in CI

- Different viewport — CI uses the config default (1280×800). Set it explicitly.
- Timing — bump `defaultCommandTimeout` for the slow spec, or wait on a network
  alias instead of the DOM.
- State leakage — run the spec in isolation locally (`it.only`) to confirm it's
  self-contained.
- Screenshots from the failed run are uploaded as a CI artifact; start there.

### "cy.visit() failed" / cross-origin errors

`baseUrl` and the URL you `visit()` must match the app's origin. For flows that
cross origins (third-party SSO), wrap the steps in
[`cy.origin()`](https://docs.cypress.io/api/commands/origin).

### My custom command has no autocomplete

Add its signature to [`cypress/support/index.d.ts`](../cypress/support/index.d.ts)
and make sure the spec starts with `/// <reference types="cypress" />`.

### How do I run a single spec / test?

```bash
npx cypress run --spec "cypress/e2e/ui/actions.cy.js"
npx cypress run --expose grep="checks every checkbox"
```

Or use `it.only` / `describe.only` while developing (ESLint's
`mocha/no-exclusive-tests` will stop it reaching `main`).

### How do I disable retries while debugging?

```bash
npx cypress run --config retries=0
```

### Where is the HTML report?

`cypress/reports/index.html`, generated automatically at the end of every run by
`cypress-mochawesome-reporter` — there is no separate merge/generate step. If it
is missing, check that the run actually started specs (a config error aborts
before the reporter's hooks fire).

### `Cypress.env() was removed in Cypress version 16.0.0`

Cypress 16 dropped `Cypress.env()`. Read non-sensitive values with
`Cypress.expose('key')` and sensitive ones with `cy.getSecret(['key'])` (or
Cypress's built-in `cy.env(['key'])`). See [configuration.md](configuration.md).

### `bad option: --no-sandbox` / Cypress "failed to start" from a VS Code terminal

The VS Code integrated terminal exports `ELECTRON_RUN_AS_NODE=1`, which makes the
Cypress Electron binary run as plain Node and reject its own flags. Unset it:

```bash
unset ELECTRON_RUN_AS_NODE
npx cypress run
```

Or run Cypress from a normal system terminal. This is a VS Code quirk, not a
framework issue.

### Can I use TypeScript?

Yes — `npm i -D typescript`, add a `tsconfig.json`, rename files to `.ts`. The
`specPattern` already matches `.ts`. See [configuration.md](configuration.md).

### Should fixtures or factories hold my test data?

Small, stable data → `cypress/fixtures/*.json`. Data that must be unique per run
→ generate it with helpers in
[`cypress/support/utils/helpers.js`](../cypress/support/utils/helpers.js)
(`uniqueName`, `randomEmail`).
