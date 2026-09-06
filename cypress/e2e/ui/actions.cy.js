/// <reference types="cypress" />

import ActionsPage from '../../pages/ActionsPage';

const actionsPage = new ActionsPage();

describe('UI · Actions form', { tags: ['@ui', '@smoke'] }, () => {
  beforeEach(() => {
    actionsPage.visit().assertLoaded();
  });

  it('types into and submits the email field', () => {
    actionsPage.typeEmail('framework@example.test');
    actionsPage.elements.emailInput().should('have.value', 'framework@example.test');
  });

  it('leaves a disabled input untouched', () => {
    actionsPage.elements.disabledInput().should('be.disabled');
  });

  it('checks every enabled checkbox in the group', () => {
    actionsPage.checkAll();
    actionsPage.elements.enabledCheckboxes().should('be.checked');
  });

  it('is data-driven over several email inputs', () => {
    const emails = ['a@example.test', 'longer.name+tag@example.test', 'x@y.io'];
    emails.forEach((email) => {
      actionsPage.typeEmail(email);
      actionsPage.elements.emailInput().should('have.value', email);
    });
  });
});
