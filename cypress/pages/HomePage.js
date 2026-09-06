/// <reference types="cypress" />

import BasePage from './BasePage';

/**
 * The landing page of https://example.cypress.io — the Cypress "Kitchen Sink"
 * demo app this framework points at out of the box.
 *
 * Replace this with page objects for your own application; the structure is the
 * point, not the specific selectors.
 */
export default class HomePage extends BasePage {
  constructor() {
    super('/');
  }

  elements = {
    banner: () => cy.get('.banner h1'),
    navbar: () => cy.get('.navbar-nav'),
    commandsDropdown: () => cy.contains('.navbar-nav a', 'Commands'),
    utilitiesLink: () => cy.contains('.navbar-nav a', 'Utilities'),
    categoryLink: (name) =>
      cy.get('ul.home-list > li > a').contains(new RegExp(`^${name}$`)),
  };

  assertLoaded() {
    this.elements.banner().should('contain.text', 'Kitchen Sink');
    return this;
  }

  openCategory(name) {
    this.elements.categoryLink(name).click();
    return this;
  }
}
