/// <reference types="cypress" />

// Type definitions for the custom commands added in
// cypress/support/commands/*. Keeping them here gives editor autocomplete and
// type-checking even though the framework itself is written in JavaScript.

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Get one or more DOM elements by their `data-cy` attribute.
     * @example cy.getByCy('submit-button').click()
     */
    getByCy(
      selector: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>,
    ): Chainable<JQuery<HTMLElement>>;

    /**
     * Get elements whose `data-cy` attribute contains the given substring.
     * @example cy.getByCyLike('row-')
     */
    getByCyLike(
      selector: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>,
    ): Chainable<JQuery<HTMLElement>>;

    /**
     * Log in through the application's login form. Cached with `cy.session`.
     */
    login(username?: string, password?: string): Chainable<void>;

    /**
     * Read one or more sensitive values from the Node-side secret store
     * (seeded from `env` / `cypress.env.json` / `CYPRESS_*`).
     */
    getSecret(keys: string | string[]): Chainable<Record<string, string>>;

    /**
     * Store sensitive values for the remainder of the run (e.g. a login token).
     */
    setSecret(values: Record<string, unknown>): Chainable<null>;

    /**
     * Assert a toast message appears with the given text, then wait for it to go.
     */
    expectToast(text: string): Chainable<void>;

    /**
     * Wrapper around `cy.request` that prefixes the exposed `apiUrl`, adds a
     * bearer token when available, and never auto-fails on non-2xx responses.
     */
    api(options?: {
      path?: string;
      url?: string;
      method?: string;
      body?: unknown;
      qs?: Record<string, unknown>;
      headers?: Record<string, string>;
      [key: string]: unknown;
    }): Chainable<Cypress.Response<any>>;

    /**
     * Authenticate via API and store the returned token in the secret store
     * (as `authToken`) for later `cy.api` calls.
     */
    apiLogin(credentials?: { email?: string; password?: string }): Chainable<string>;
  }
}
