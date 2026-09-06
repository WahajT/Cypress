# Writing tests

## Anatomy of a spec

```js
/// <reference types="cypress" />

import LoginPage from '../../pages/LoginPage';

const loginPage = new LoginPage();

describe('Login', { tags: ['@ui', '@smoke'] }, () => {
  beforeEach(() => {
    loginPage.visit();
  });

  it('rejects a wrong password', () => {
    loginPage.signIn('user@example.test', 'wrong');
    loginPage.elements.error().should('contain.text', 'Invalid credentials');
  });
});
```

- The `/// <reference types="cypress" />` line gives you autocomplete, including
  the framework's own custom commands (via `cypress/support/index.d.ts`).
- The `{ tags: [...] }` object is read by [`@cypress/grep`](https://github.com/cypress-io/cypress/tree/develop/npm/grep)
  — see [Tagging & filtering](#tagging--filtering) below.

## Conventions

### Use `data-cy` selectors

```js
cy.getByCy('submit-order').click(); // ✓  resilient
cy.get('.btn.btn-primary:nth-child(2)'); // ✗  breaks on restyle
```

Ask your app developers to add `data-cy="…"` attributes to interactive elements.

### Never use a fixed wait

```js
cy.wait(3000); // ✗  flaky and slow
cy.wait('@getCart'); // ✓  wait for the network call
cy.getByCy('total').should('be.visible'); // ✓  wait for the state
```

Cypress retries assertions automatically; lean on that.

### One behaviour per `it`

A test should fail for exactly one reason. Prefer several small `it` blocks over
one long scenario, unless the steps genuinely form a single user journey.

### Keep tests independent

Every `it` must pass when run alone (`it.only`) and in any order. Set up state in
`beforeEach` (ideally via API, not the UI), and don't rely on a previous test.

### Assert intent, not implementation

```js
cy.getByCy('cart-count').should('have.text', '2'); // ✓
cy.window().its('store.getState').its('cart.items.length'); // ✗ couples to internals
```

## Data-driven tests

Loop over an array, or over a fixture:

```js
const cases = [
  { input: '', error: 'Required' },
  { input: 'ab', error: 'Too short' },
];

cases.forEach(({ input, error }) => {
  it(`shows "${error}" for ${JSON.stringify(input)}`, () => {
    field.type(input).blur();
    field.error().should('have.text', error);
  });
});
```

```js
beforeEach(() => {
  cy.fixture('users').as('users');
});

it('logs in the admin user', function () {
  cy.apiLogin(this.users.admin);
});
```

## Network control

```js
it('shows an empty state when the cart API returns nothing', () => {
  cy.intercept('GET', '/api/cart', { body: { items: [] } }).as('cart');
  cy.visit('/cart');
  cy.wait('@cart');
  cy.getByCy('cart-empty').should('be.visible');
});
```

Use `cy.intercept` to stub third-party calls and error paths; hit the real API
for the happy path so the contract stays covered.

## Tagging & filtering

Add tags in the suite/test config object:

```js
describe('Checkout', { tags: ['@regression'] }, () => {
  it('applies a coupon', { tags: '@smoke' }, () => {
    /* … */
  });
});
```

Run a subset:

```bash
npx cypress run --expose grepTags=@smoke
npx cypress run --expose grepTags="@smoke+@regression"   # both
npx cypress run --expose grepTags="@smoke @regression"   # either
npx cypress run --expose grep="applies a coupon"          # by title
```

> `@cypress/grep` v7 reads its options from Cypress's `expose` channel, so the
> flag is `--expose`, not `--env`.

`grepFilterSpecs` and `grepOmitFiltered` are already enabled (in the `expose`
block of `cypress.config.js`), so filtered-out specs are skipped entirely and
don't appear in the report.

## Retries & flake

`cypress.config.js` sets `retries.runMode = 2`: a failing test is retried twice
in CI before it's reported as failed. This absorbs genuine infrastructure blips —
it is **not** a licence to ship flaky tests. If a test only passes on retry,
fix it.
