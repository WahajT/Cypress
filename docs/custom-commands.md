# Custom commands

Custom commands extend the `cy.*` API with project-specific shortcuts. They live
in [`cypress/support/commands/`](../cypress/support/commands/), one file per area,
all re-exported from `index.js`, which `support/e2e.js` imports.

## What ships with the framework

| Command                             | Purpose                                                                                             |
| ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| `cy.getByCy(selector, opts?)`       | Get element(s) by `data-cy` attribute                                                               |
| `cy.getByCyLike(substr, opts?)`     | Get element(s) whose `data-cy` contains a substring                                                 |
| `cy.login(user?, pass?)`            | UI login, cached with `cy.session` (template — adapt selectors)                                     |
| `cy.expectToast(text)`              | Assert a toast appears with `text`, then wait for it to vanish                                      |
| `cy.getSecret(keys)`                | Read sensitive values from the Node-side secret store (`cy.getSecret(['authToken'])`)               |
| `cy.setSecret(values)`              | Write sensitive values for the rest of the run (`cy.setSecret({ authToken })`)                      |
| `cy.api({ path, method, body, … })` | `cy.request` wrapper: prefixes the exposed `apiUrl`, adds bearer token, never auto-fails on non-2xx |
| `cy.apiLogin(creds?)`               | Authenticate via API, store the token via `cy.setSecret`                                            |

> **Cypress 16 note:** `Cypress.env()` was removed. Non-sensitive config is read
> synchronously with `Cypress.expose('key')`; secrets go through
> `cy.getSecret` / `cy.setSecret` (see [configuration.md](configuration.md)).

## Adding a command

1. **Implement it** in the right file (or a new one) under `commands/`:

   ```js
   // cypress/support/commands/cart.js
   Cypress.Commands.add('addToCart', (sku, qty = 1) => {
     return cy.api({
       method: 'POST',
       path: '/cart/items',
       body: { sku, qty },
     });
   });
   ```

2. **Register the file** in `cypress/support/commands/index.js`:

   ```js
   import './cart';
   ```

3. **Add its type** to `cypress/support/index.d.ts` so specs get autocomplete:

   ```ts
   addToCart(sku: string, qty?: number): Chainable<Cypress.Response<any>>;
   ```

## Guidelines

- **Return the chainable.** `return cy.request(...)` — so callers can `.then()`.
- **Keep secrets out of logs:** pass `{ log: false }` to `.type()` for passwords,
  and to `cy.request` options where needed.
- **Don't put assertions in commands** unless the command's whole job is the
  assertion (like `cy.expectToast`). A command that logs in should log in, not
  assert page content.
- **Prefer API over UI for setup.** `cy.apiLogin()` in a `beforeEach` is far
  faster and less flaky than driving the login form every time. Use
  `cy.session()` to cache whichever you use.
- **Overwrite built-ins sparingly** with `Cypress.Commands.overwrite` — it
  affects every test.

## Parent vs child commands

```js
// Parent — starts a chain
Cypress.Commands.add('api', (opts) => {
  /* … */
});

// Child — receives the previous subject
Cypress.Commands.add('shouldHaveStatus', { prevSubject: true }, (res, code) => {
  expect(res.status).to.eq(code);
  return res;
});

// cy.api({ path: '/health' }).shouldHaveStatus(200);
```
