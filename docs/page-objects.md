# Page objects

A **page object** is a class that represents one screen (or a meaningful
component) of the application. It centralises _how to find things_ and _how to
interact_, so specs stay short and survive UI changes.

## The base class

Every page extends [`BasePage`](../cypress/pages/BasePage.js), which provides
`visit()`, `assertLoaded()`, `getTitle()` and `reveal()`.

## Writing one

```js
/// <reference types="cypress" />
import BasePage from './BasePage';

export default class LoginPage extends BasePage {
  constructor() {
    super('/login'); // path relative to baseUrl
  }

  // Locators are functions, so they are evaluated lazily at call time.
  elements = {
    email: () => cy.getByCy('login-email'),
    password: () => cy.getByCy('login-password'),
    submit: () => cy.getByCy('login-submit'),
    error: () => cy.getByCy('login-error'),
  };

  // Actions return `this` (or a new page object) for fluent chaining.
  signIn(email, password) {
    this.elements.email().clear().type(email);
    this.elements.password().clear().type(password, { log: false });
    this.elements.submit().click();
    return this;
  }
}
```

Usage in a spec:

```js
const loginPage = new LoginPage();

it('logs in', () => {
  loginPage.visit();
  loginPage.signIn('user@example.test', 's3cret');
  cy.location('pathname').should('eq', '/dashboard');
});
```

## Rules of thumb

| Do                                                         | Don't                                                 |
| ---------------------------------------------------------- | ----------------------------------------------------- |
| Expose locators as `() => cy.get(...)` functions           | Store `cy.get(...)` results in fields (they go stale) |
| Return `this` or the next page object from actions         | Put `expect` / test assertions in the page object     |
| Keep one class per screen/component                        | Build a god-object for the whole app                  |
| Use `cy.getByCy` / `data-cy`                               | Hard-code fragile CSS chains                          |
| Model a reusable widget (nav bar, modal) as its own object | Duplicate its selectors in every page                 |

## Navigating between pages

Return the destination page object so specs read as a flow:

```js
class LoginPage extends BasePage {
  signIn(email, password) {
    /* … */
    return new DashboardPage();
  }
}

const dashboard = new LoginPage().visit().signIn(email, password);
dashboard.assertLoaded();
```

## Components

A shared piece of UI — say the top navigation — is just a page object without a
path:

```js
export class NavBar {
  elements = {
    root: () => cy.getByCy('navbar'),
    cartLink: () => cy.getByCy('nav-cart'),
  };
  openCart() {
    this.elements.cartLink().click();
    return new CartPage();
  }
}
```

Instantiate it wherever it appears.
