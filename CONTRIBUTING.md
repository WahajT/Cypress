# Contributing

Thanks for taking the time to contribute! This project is meant to be forked and
adapted, and improvements to the base framework are very welcome.

## Getting set up

```bash
git clone https://github.com/WahajT/cypress-framework.git
cd cypress-framework
npm install
npm run cy:open
```

Node 22+ is required (see [`.nvmrc`](.nvmrc); run `nvm use`).

## Development workflow

1. Create a branch: `git checkout -b feat/short-description`.
2. Make your change. Keep the [project structure](docs/project-structure.md) intact.
3. Run the checks locally:
   ```bash
   npm run lint
   npm run format:check
   npm run test          # or: npm run test:api / npm run test:ui
   ```
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/)
   (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`).
5. Open a pull request against `main`. CI must pass.

## What to keep in mind

- **Selectors:** prefer `data-cy` attributes and the `cy.getByCy()` command over
  brittle CSS or text selectors.
- **No hard waits:** never `cy.wait(<number>)`. Wait on a state, a network alias,
  or an assertion instead.
- **Page objects hold locators and interactions; specs hold assertions.**
- **New custom command?** Add it under `cypress/support/commands/`, register it in
  `cypress/support/commands/index.js`, and add its type to
  `cypress/support/index.d.ts`.
- **New docs?** Add a file under `docs/` and link it from the README.

## Reporting bugs / requesting features

Open an issue with a minimal reproduction (a failing spec is ideal) and the
output of `npx cypress info`.
