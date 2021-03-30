/*jshint esversion: 6 */
import {
  EMAIL_ADDRESS_INVALID,
  FIRST_NAME_PATTERN,
  LAST_NAME_INVALID,
  PASSWORS_DONT_MATCH,
  SERVER_ERROR,
  SIGN_OUT_ERROR,
  SIGN_UP_SUCCES,
} from '../fixtures/constants';
import { userModelSuccess, userModelFail } from '../fixtures/userModel';
import { quickFillForm } from './utils/signupFormUtils';

describe('FDX integration tests, base logics: signup, logout', () => {
  Cypress.on('fail', (error, runnable) => {
    // debugger;
    // we now have access to the err instance
    // and the mocha runnable this failed on
    // throw error // throw error to have test still fail
  });

  beforeEach(() => {
    cy.visit('/#/?e2e=true');
  });

  it('should fill out signup form en successfully submit', () => {
    quickFillForm(userModelFail);

    cy.get('.form-group > :nth-child(2) > .text-danger').contains(LAST_NAME_INVALID);
    cy.get(':nth-child(5) > .text-danger').contains(PASSWORS_DONT_MATCH);
    cy.get(':nth-child(3) > .text-danger').contains(EMAIL_ADDRESS_INVALID);

    const firstNameLower = userModelFail.firstName.toLowerCase();
    const message = `${FIRST_NAME_PATTERN} ${firstNameLower}`;
    cy.get('.col-6.height--0 > .text-danger').contains(message);

    cy.get('[data-cy=submit]').should('be.disabled');

    cy.get('input[formControlName=lastName]').clear().type('Falcon');
    cy.get('input[formControlName=emailAddress]').type('.com');
    const newPassword = 'Sjv36393639';
    cy.get('input[formControlName="password"]').clear().type(newPassword);
    cy.get('input[formControlName="confirmPassword"]').clear().type(newPassword).blur();
    cy.get('[data-cy=submit]').should('be.enabled');

    cy.intercept('POST', '/user/handleUserSignUp', { fixture: 'handleUserSignUp.json' }).as('userSignUp');
    // cy.intercept('POST', '/user/handleUserSignUp').as('userSignUp');
    cy.get('[data-cy=submit]').click();
    cy.wait('@userSignUp');

    cy.get('h1 > span').contains(`Hello ${userModelFail.firstName}`);
    cy.get('.alert').contains(SIGN_UP_SUCCES);
  });

  it('should give error on log out', () => {
    quickFillForm(userModelSuccess);
    cy.get('[data-cy=submit]').click();

    cy.server().route({
      method: 'POST',
      url: '/user/handleUserSignOut',
      status: 401,
      response: {
        message: SIGN_OUT_ERROR,
      },
    });

    cy.get('#user-dropdown').click();

    cy.intercept('POST', '/user/handleUserSignOut').as('userSignOut');
    cy.get('.cursor-pointer').click();
    // cy.wait('@userSignOut');

    cy.get('.alert').then(($elem) => {
      expect($elem).to.have.text(SERVER_ERROR);
    });
  });
});
