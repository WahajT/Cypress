# Reporting

The framework uses
[`cypress-mochawesome-reporter`](https://github.com/LironEr/cypress-mochawesome-reporter)
to produce a single self-contained HTML report with failure screenshots embedded.

## How it works

The reporter's plugin (registered in `cypress.config.js`) and its browser hook
(imported in `cypress/support/e2e.js`) do everything automatically:

1. Each spec writes a JSON to `cypress/reports/.jsons/`.
2. At the end of the run they are merged and rendered to
   **`cypress/reports/index.html`**.

There is no separate merge/generate step to run.

```bash
npm test                       # run specs → report at cypress/reports/index.html
xdg-open cypress/reports/index.html   # (or open it in any browser)
```

`npm test` runs `npm run clean` first (via `pretest`), so every run starts from
an empty `cypress/reports/`, `cypress/screenshots/`, and `cypress/videos/`.

> The `cy:run*` scripts do **not** clean first, so the reporter appends to the
> existing report. Run `npm run clean` yourself if you want a fresh one.

## What's in the report

- Pass/fail/skip counts and duration, with charts
- Every test grouped by spec file and `describe` block
- The full command log for failures
- Failure screenshots, embedded inline (no separate files to ship)
- Test tags (`@smoke`, …) from `@cypress/grep`

## Configuration

Set in `reporterOptions` in [`cypress.config.js`](../cypress.config.js). Any
[mochawesome-report-generator flag](https://github.com/adamgruber/mochawesome-report-generator#cli-flags)
is accepted here.

| Option                | Value                      | Meaning                                        |
| --------------------- | -------------------------- | ---------------------------------------------- |
| `reportDir`           | `cypress/reports`          | Output location                                |
| `reportPageTitle`     | `Cypress Framework Report` | `<title>` of the HTML report                   |
| `charts`              | `true`                     | Render the summary doughnut charts             |
| `embeddedScreenshots` | `true`                     | Put screenshots in the HTML                    |
| `inlineAssets`        | `true`                     | Inline CSS/JS so the HTML is one portable file |
| `saveAllAttempts`     | `false`                    | Keep only the last attempt of a retried test   |

## CI

The [CI workflow](../.github/workflows/ci.yml) uploads `cypress/reports/` as a
build artifact named `cypress-report-<browser>` (on success and failure).
Download it from the run's **Summary** page.

To publish to GitHub Pages instead, add a `peaceiris/actions-gh-pages` step
pointing at `cypress/reports`.

## Other reporters

Swap `reporter` / `reporterOptions` in `cypress.config.js`. Popular choices:

- **JUnit** (`mocha-junit-reporter`) — for test-result tabs in Jenkins/GitLab.
- **`cypress-multi-reporters`** — emit mochawesome _and_ JUnit together.
- **Cypress Cloud** (`npx cypress run --record --key <key>`) — hosted dashboard,
  parallelisation, flake detection.
