/// <reference types="cypress" />

/**
 * Base class for every page object.
 *
 * Page objects encapsulate *where things are* and *how to interact with a
 * screen*, so specs can read as plain user intent. Keep assertions light in
 * here (a page object may expose small "is loaded" checks) but keep test-level
 * expectations in the spec.
 */
export default class BasePage {
  /**
   * @param {string} [path] path relative to `baseUrl`, e.g. '/commands/actions'
   */
  constructor(path = '/') {
    this.path = path;
  }

  /** Visit this page and return itself for chaining. */
  visit(options = {}) {
    cy.visit(this.path, options);
    return this;
  }

  /** Assert the browser is on this page's path. */
  assertLoaded() {
    cy.location('pathname').should('include', this.path);
    return this;
  }

  /** The document title. */
  getTitle() {
    return cy.title();
  }

  /** Scroll an element into view before the next action. */
  reveal(selector) {
    cy.get(selector).scrollIntoView();
    return this;
  }
}
