/// <reference types="cypress" />

/**
 * Select an element by its `data-cy` attribute.
 *
 * Prefer dedicated test attributes over CSS/text selectors so tests do not
 * break when styling or copy changes.
 *
 * @example cy.getByCy('submit-button').click()
 */
Cypress.Commands.add('getByCy', (selector, ...args) => {
  return cy.get(`[data-cy="${selector}"]`, ...args);
});

/**
 * Select an element by a substring of its `data-cy` attribute.
 * @example cy.getByCyLike('row-') // every element whose data-cy starts with "row-"
 */
Cypress.Commands.add('getByCyLike', (selector, ...args) => {
  return cy.get(`[data-cy*="${selector}"]`, ...args);
});

/**
 * UI login through a login form. This is a template — point the selectors and
 * the URL at your real application, or delete it if you only log in via API.
 *
 * Wrapped in `cy.session` so the logged-in state is cached and restored between
 * tests instead of repeating the flow every time.
 *
 * @param {string} [username] defaults to the `userEmail` secret
 * @param {string} [password] defaults to the `userPassword` secret
 */
Cypress.Commands.add('login', (username, password) => {
  cy.getSecret(['userEmail', 'userPassword']).then(({ userEmail, userPassword }) => {
    const user = username ?? userEmail;
    const pass = password ?? userPassword;

    cy.session(
      ['ui-login', user],
      () => {
        cy.visit('/login');
        cy.getByCy('login-email').type(user);
        cy.getByCy('login-password').type(pass, { log: false });
        cy.getByCy('login-submit').click();
        cy.location('pathname', { timeout: 10000 }).should('not.include', '/login');
      },
      {
        validate() {
          // Cheap check that the cached session is still valid.
          cy.getCookies().should('not.be.empty');
        },
        cacheAcrossSpecs: true,
      },
    );
  });
});

/**
 * Assert that a toast / flash message with the given text is visible, then wait
 * for it to disappear so it does not cover later interactions.
 */
Cypress.Commands.add('expectToast', (text) => {
  cy.getByCy('toast').should('be.visible').and('contain.text', text);
  cy.getByCy('toast').should('not.exist');
});
