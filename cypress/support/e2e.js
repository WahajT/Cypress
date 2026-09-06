// ***********************************************************
// This file is loaded automatically before every e2e spec.
// Put global behaviour here: custom commands, reporter setup,
// global hooks, and uncaught-exception policy.
//
// https://on.cypress.io/configuration#support-file
// ***********************************************************

import 'cypress-mochawesome-reporter/register';
import { register as registerCypressGrep } from '@cypress/grep';
import './commands';

registerCypressGrep();

/**
 * By default Cypress fails a test if the application under test throws an
 * uncaught exception. That is usually what you want. If a specific third-party
 * script in your app is noisy, narrow this down instead of blanket-ignoring —
 * return `false` only for the errors you have consciously accepted.
 */
Cypress.on('uncaught:exception', (err) => {
  const ignored = [
    // 'ResizeObserver loop limit exceeded',
  ];
  return !ignored.some((message) => err.message.includes(message));
});

// Make each test's title visible in the command log for easier debugging.
// `cy.task('log', …)` also prints it to the terminal — handy in CI logs.
beforeEach(function logTestName() {
  const test = this.currentTest;
  if (test) {
    cy.task('log', `▶ ${test.fullTitle()}`, { log: false });
  }
});
