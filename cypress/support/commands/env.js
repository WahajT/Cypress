/// <reference types="cypress" />

/**
 * Cypress 16 removed `Cypress.env()`. Non-sensitive values now come from
 * `Cypress.expose('key')` (synchronous, visible in reports); sensitive values
 * live in a Node-side store that the browser can only query one key at a time.
 *
 * These two commands wrap that store (backed by the `secret:get` / `secret:set`
 * tasks registered in `cypress.config.js`).
 */

/**
 * Read one or more sensitive values.
 * @param {string[]} keys
 * @returns Cypress.Chainable<Record<string, string>>
 * @example
 *   cy.getSecret(['authToken']).then(({ authToken }) => { ... })
 */
Cypress.Commands.add('getSecret', (keys) => {
  const list = Array.isArray(keys) ? keys : [keys];
  return cy.task('secret:get', list, { log: false });
});

/**
 * Store sensitive values for the rest of the run (e.g. a token obtained by
 * logging in). Not persisted between runs.
 * @param {Record<string, unknown>} values
 * @example cy.setSecret({ authToken: token })
 */
Cypress.Commands.add('setSecret', (values) => {
  return cy.task('secret:set', values, { log: false });
});
