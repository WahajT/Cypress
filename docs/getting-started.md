# Getting started

## Prerequisites

| Tool        | Version     | Notes                                                                                                                                         |
| ----------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js     | 22 or newer | `nvm use` reads [`.nvmrc`](../.nvmrc)                                                                                                         |
| npm         | 9 or newer  | ships with Node                                                                                                                               |
| OS packages | Linux only  | Cypress needs a few libs — see the [Cypress system requirements](https://docs.cypress.io/app/get-started/install-cypress#System-requirements) |

## Install

```bash
git clone https://github.com/WahajT/cypress-framework.git
cd cypress-framework
npm install
```

`npm install` also downloads the Cypress binary. To verify:

```bash
npx cypress verify
npx cypress info
```

## Run the example tests

The framework ships pointed at two public demo targets so tests pass on a fresh
clone with zero configuration:

- UI specs run against <https://example.cypress.io> (the Cypress "Kitchen Sink")
- API specs run against <https://jsonplaceholder.typicode.com>

```bash
# Interactive runner (pick a browser, watch tests run)
npm run cy:open

# Headless, everything
npm test

# Headless, one group
npm run test:ui
npm run test:api

# Only tests tagged @smoke
npm run test:smoke
```

## Point it at your own application

1. Edit [`cypress/config/local.json`](../cypress/config/local.json) — set `baseUrl`
   to your app and `expose.apiUrl` to your API.
2. Replace the page objects in [`cypress/pages/`](../cypress/pages/) with ones for
   your screens.
3. Replace the specs in [`cypress/e2e/`](../cypress/e2e/).
4. Wire up real authentication in
   [`cypress/support/commands/ui.js`](../cypress/support/commands/ui.js) and
   [`cypress/support/commands/api.js`](../cypress/support/commands/api.js).

See [configuration.md](configuration.md) and [environments.md](environments.md)
for the details.

## Next steps

- [Project structure](project-structure.md)
- [Writing tests](writing-tests.md)
- [Page objects](page-objects.md)
- [Custom commands](custom-commands.md)
- [Configuration](configuration.md)
- [Environments](environments.md)
- [Reporting](reporting.md)
- [CI](ci.md)
- [FAQ / troubleshooting](faq.md)
