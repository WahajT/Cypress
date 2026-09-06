/// <reference types="cypress" />

import HomePage from '../../pages/HomePage';

const homePage = new HomePage();

describe('UI · Navigation', { tags: ['@ui'] }, () => {
  beforeEach(() => {
    homePage.visit().assertLoaded();
  });

  it('shows the Kitchen Sink banner', () => {
    homePage.elements.banner().should('be.visible');
  });

  it('navigates from the home page into a command category', () => {
    homePage.openCategory('Actions');
    cy.location('pathname').should('include', '/commands/actions');
    cy.get('h1').should('contain.text', 'Actions');
  });

  it('goes back and forward through history', () => {
    homePage.openCategory('Querying');
    cy.location('pathname').should('include', '/commands/querying');
    cy.go('back');
    cy.location('pathname').should('eq', '/');
    cy.go('forward');
    cy.location('pathname').should('include', '/commands/querying');
  });
});
