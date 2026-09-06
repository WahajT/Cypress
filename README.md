# Cypress Framework

A ready-to-use, scalable [Cypress](https://www.cypress.io/) framework for
end-to-end **and** API testing. Clone it, `npm install`, and start writing tests
— the example suite passes out of the box against public demo targets.

[![CI](https://github.com/WahajT/cypress-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/WahajT/cypress-framework/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Why this framework

|                          |                                                                            |
| ------------------------ | -------------------------------------------------------------------------- |
| **Page Object Model**    | A `BasePage` + example pages keep selectors out of specs                   |
| **Custom commands**      | `cy.getByCy`, `cy.api`, `cy.login`, `cy.apiLogin` — extensible, typed      |
| **Multi-environment**    | Swap `local` / `staging` / `production` with one flag; no config sprawl    |
| **API testing built in** | `cy.api()` wrapper with base URL, auth token, and non-2xx handling         |
| **Cypress 16 ready**     | Uses `Cypress.expose()` for config and a secret store for tokens/passwords |
| **Tagging & filtering**  | `@smoke` / `@regression` via `@cypress/grep`                               |
| **HTML reports**         | One portable file with embedded failure screenshots (mochawesome)          |
| **CI ready**             | GitHub Actions: lint → cross-browser run → report artifact                 |
| **Quality gates**        | ESLint (flat config) + Prettier + editor autocomplete for custom commands  |
| **Zero secrets in git**  | Credentials via `cypress.env.json` or `CYPRESS_*` env vars                 |

## Quick start

```bash
git clone https://github.com/WahajT/cypress-framework.git
cd cypress-framework
npm install

npm run cy:open      # interactive runner
npm test             # headless, all specs → report at cypress/reports/index.html
```

Requires **Node 22+** (`nvm use`). The HTML report is generated automatically at
the end of every `npm test` run — no extra step.

## Every npm script

| Command                                   | What it does                                                      |
| ----------------------------------------- | ----------------------------------------------------------------- |
| `npm run cy:open`                         | Open the interactive Cypress runner                               |
| `npm run cy:run`                          | Headless run, default browser (Electron)                          |
| `npm run cy:run:chrome`                   | Headless run in Chrome                                            |
| `npm run cy:run:firefox`                  | Headless run in Firefox                                           |
| `npm run cy:run:headed`                   | Headless-mode run with the browser window visible                 |
| `npm test`                                | `clean` + run every spec headless → `cypress/reports/index.html`  |
| `npm run test:ui`                         | Run only `cypress/e2e/ui/**`                                      |
| `npm run test:api`                        | Run only `cypress/e2e/api/**`                                     |
| `npm run test:smoke`                      | Run only tests tagged `@smoke` (`--expose grepTags=@smoke`)       |
| `npm run test:local`                      | Run against `cypress/config/local.json` (the default)             |
| `npm run test:staging`                    | Run against `cypress/config/staging.json`                         |
| `npm run test:production`                 | Run against `cypress/config/production.json`                      |
| `npm run clean`                           | Delete `cypress/reports`, `cypress/screenshots`, `cypress/videos` |
| `npm run lint` / `npm run lint:fix`       | ESLint (flat config)                                              |
| `npm run format` / `npm run format:check` | Prettier — write / verify                                         |

`pretest` runs `clean` automatically before `npm test`. The `cy:run*` scripts do
**not** clean first, so the report accumulates until you run `npm run clean`.

## Project structure

```
cypress/
├── config/        per-environment JSON (local, staging, production)
├── e2e/
│   ├── ui/        browser specs        (*.cy.js)
│   └── api/       HTTP specs           (*.cy.js)
├── fixtures/      static test data
├── pages/         Page Object Model    (BasePage + one class per screen)
└── support/
    ├── e2e.js         loaded before every spec
    ├── commands/      custom cy.* commands (index.js is the barrel)
    ├── utils/         pure helpers (no cy.*)
    └── index.d.ts     types for custom commands
```

Full walkthrough: **[docs/project-structure.md](docs/project-structure.md)**.

## Point it at your app

1. Set `baseUrl` and `expose.apiUrl` in [`cypress/config/local.json`](cypress/config/local.json).
2. Replace the page objects in [`cypress/pages/`](cypress/pages/) and specs in [`cypress/e2e/`](cypress/e2e/).
3. Implement real auth in [`cypress/support/commands/`](cypress/support/commands/).
4. Put credentials in `cypress.env.json` (git-ignored) — see [docs/environments.md](docs/environments.md).

## Writing a test (30-second version)

```js
/// <reference types="cypress" />
import HomePage from '../../pages/HomePage';

const home = new HomePage();

describe('Home', { tags: ['@smoke'] }, () => {
  beforeEach(() => home.visit());

  it('shows the banner', () => {
    home.elements.banner().should('be.visible');
  });
});
```

More: **[docs/writing-tests.md](docs/writing-tests.md)**.

## Documentation

| Guide                                          |                                                             |
| ---------------------------------------------- | ----------------------------------------------------------- |
| [Getting started](docs/getting-started.md)     | Install, run, point at your app                             |
| [Project structure](docs/project-structure.md) | Every folder, and the layering rule                         |
| [Writing tests](docs/writing-tests.md)         | Conventions, data-driven tests, network stubbing, tags      |
| [Page objects](docs/page-objects.md)           | The pattern, the base class, do's & don'ts                  |
| [Custom commands](docs/custom-commands.md)     | What ships, how to add one, typing it                       |
| [Configuration](docs/configuration.md)         | Every setting and why it's set                              |
| [Environments](docs/environments.md)           | The `configFile` mechanism, secrets                         |
| [Reporting](docs/reporting.md)                 | mochawesome, CI artifacts, alternatives                     |
| [CI](docs/ci.md)                               | The GitHub Actions pipeline, parallelisation, other runners |
| [FAQ / troubleshooting](docs/faq.md)           | Common failures and fixes                                   |

## Contributing

Issues and PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) and the
[Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE) © Wahaj Tahir
