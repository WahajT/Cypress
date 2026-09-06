/// <reference types="cypress" />

import BasePage from './BasePage';

/**
 * https://example.cypress.io/commands/actions — demonstrates typing, focus,
 * clearing, checking, selecting, and clicking.
 */
export default class ActionsPage extends BasePage {
  constructor() {
    super('/commands/actions');
  }

  elements = {
    emailInput: () => cy.get('.action-email'),
    disabledInput: () => cy.get('.action-disabled'),
    focusInput: () => cy.get('.action-focus'),
    checkboxes: () => cy.get('.action-checkboxes [type="checkbox"]'),
    enabledCheckboxes: () =>
      cy.get('.action-checkboxes [type="checkbox"]:not([disabled])'),
    select: () => cy.get('.action-select'),
    submitBtn: () => cy.get('.action-form .btn'),
  };

  typeEmail(value) {
    this.elements.emailInput().clear().type(value);
    return this;
  }

  submitForm() {
    this.elements.submitBtn().click();
    return this;
  }

  checkAll() {
    this.elements.enabledCheckboxes().check();
    return this;
  }
}
