# Project structure

```
.
├── cypress.config.js              # Single source of Cypress config + env loading
├── cypress/
│   ├── config/                    # Per-environment settings (local, staging, production)
│   │   ├── local.json
│   │   ├── staging.json
│   │   └── production.json
│   ├── e2e/                       # Test specs, grouped by type
│   │   ├── ui/                    #   *.cy.js  browser tests
│   │   └── api/                   #   *.cy.js  HTTP tests (no browser needed)
│   ├── fixtures/                  # Static test data loaded with cy.fixture()
│   │   ├── users.json
│   │   └── posts.json
│   ├── pages/                     # Page Object Model
│   │   ├── BasePage.js            #   shared navigation / assertions
│   │   ├── HomePage.js
│   │   └── ActionsPage.js
│   ├── support/
│   │   ├── e2e.js                 # Loaded before every spec (global hooks, reporter)
│   │   ├── commands/              # Custom cy.* commands, one file per area
│   │   │   ├── index.js           #   barrel — imported by e2e.js
│   │   │   ├── env.js             #   getSecret / setSecret (Cypress 16 secret store)
│   │   │   ├── ui.js
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── helpers.js         # Pure helpers (no cy.*): random data, dates…
│   │   └── index.d.ts             # Types for custom commands (editor autocomplete)
│   ├── downloads/                 # cy downloads land here (git-ignored)
│   └── reports/                   # index.html + screenshots, built each run (git-ignored)
├── docs/                          # This documentation
├── .github/workflows/ci.yml       # GitHub Actions pipeline
├── eslint.config.mjs              # Flat ESLint config
├── .prettierrc                    # Formatting rules
└── package.json                   # Scripts & dependencies
```

## The layering rule

```
spec  ──uses──▶  page object  ──uses──▶  custom command / cy.*  ──▶  app
  │                                          ▲
  └───────────── assertions live here ───────┘
```

- **Specs** describe behaviour and own the assertions (`expect` / `.should`).
- **Page objects** own selectors and multi-step interactions. They may expose a
  small `assertLoaded()`-style check, nothing more.
- **Custom commands** wrap repeated low-level sequences (login, API calls).
- **Helpers** are pure functions — no `cy.*` — so they are trivial to reason about.

Keeping these layers separate is what makes the suite scale: a selector change
touches one page object, not fifty specs.

## Naming conventions

| Thing          | Convention                   | Example                  |
| -------------- | ---------------------------- | ------------------------ |
| Spec file      | `<feature>.cy.js`            | `checkout.cy.js`         |
| Page object    | `PascalCase` + `Page` suffix | `CheckoutPage.js`        |
| Fixture        | `lowercase.json`             | `users.json`             |
| Custom command | `camelCase` verb             | `cy.apiLogin()`          |
| `data-*` hook  | `data-cy="kebab-case"`       | `data-cy="submit-order"` |
| Tag            | `@lowercase`                 | `@smoke`, `@regression`  |
