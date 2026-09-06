# Continuous integration

A ready-to-run GitHub Actions pipeline is in
[`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

## What it does

```
push / PR to main
      │
      ├── lint ......... npm ci → npm run lint → npm run format:check
      │
      └── e2e (needs: lint) ── matrix: [chrome, firefox]
              │
              ├── cypress-io/github-action@v6  (installs, caches, runs)
              │     npx cypress run --browser <b> --env configFile=staging
              │     (reporter writes cypress/reports/index.html at end of run)
              ├── upload cypress/reports    (always)  → artifact
              └── upload screenshots        (on failure)
```

- **`concurrency`** cancels superseded runs on the same branch.
- **`fail-fast: false`** so a Chrome failure still lets Firefox finish.
- The Cypress binary and npm cache are restored automatically by
  `actions/setup-node` (`cache: npm`) and `cypress-io/github-action`.

## Configure it for your project

1. **Target environment** — change `--env configFile=staging` to whichever
   `cypress/config/*.json` you want CI to hit.
2. **Secrets** — add repository secrets and pass them through as env vars:
   ```yaml
   - name: Run Cypress
     uses: cypress-io/github-action@v6
     with:
       browser: ${{ matrix.browser }}
       command: npx cypress run --browser ${{ matrix.browser }} --env configFile=staging
     env:
       CYPRESS_userEmail: ${{ secrets.TEST_USER_EMAIL }}
       CYPRESS_userPassword: ${{ secrets.TEST_USER_PASSWORD }}
   ```
3. **Browsers** — edit the `matrix.browser` list (`edge`, `electron` also work).

## Speeding it up: parallelisation

### With Cypress Cloud

```yaml
strategy:
  matrix:
    containers: [1, 2, 3, 4]
steps:
  - uses: cypress-io/github-action@v6
    with:
      record: true
      parallel: true
      group: e2e-${{ matrix.browser }}
    env:
      CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
```

### Without Cypress Cloud

Split specs across jobs with a matrix and `--spec`, or use a community
orchestrator such as `cypress-split`.

## Other CI systems

The commands are plain npm scripts, so any runner works. The essentials:

```bash
npm ci
npx cypress install          # ensure the binary is present / cached
npm run lint
npx cypress run --browser chrome --env configFile=staging
# → report is written to cypress/reports/index.html automatically
```

Cache `~/.cache/Cypress` and `node_modules` (or `~/.npm`) between runs.

- **GitLab CI:** use the `cypress/browsers` Docker image.
- **Jenkins:** same image in a `docker` agent; publish `cypress/reports`
  with the HTML Publisher plugin.
- **CircleCI:** the official `cypress-io/cypress` orb.
