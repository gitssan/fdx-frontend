/*jshint esversion: 6 */

describe('FDX integration tests, base logics: signup, logout', () => {
  Cypress.on('fail', (error, runnable) => {
    // debugger;
    // we now have access to the err instance
    // and the mocha runnable this failed on
    // throw error // throw error to have test still fail
  });

  beforeEach(() => {});

  it('open sign-up form', () => {
    cy.visit('/#/?e2e=true');

    cy.get(':button').should('be.disabled');

    cy.get('input[formControlName="firstName"]').type('Gitssan');

    cy.get('input[formControlName="lastName"]').type('Falcon');

    cy.get('input[formControlName="emailAddress"]').type('Fdx36393639@gmail.com');

    cy.get('input[formControlName="password"]').type('Fdx12341234');

    cy.get('input[formControlName="confirmPassword"]').type('Fdx123412').blur();

    cy.get(':nth-child(5) > .text-danger').contains('Passwords dont match');

    cy.get(':button').should('be.disabled');

    cy.get('input[formControlName="confirmPassword"]').then(($input) => {
      $input.val('');
    });

    cy.get('input[formControlName="confirmPassword"]').type('Fdx12341234').blur();

    cy.get(':button').should('be.enabled');

    cy.intercept('POST', '/user/handleUserSignUp').as('userSignUp');
    cy.get(':button').click();
    cy.wait('@userSignUp');

    cy.get('h1 > span').contains('Hello Gitssan');

    cy.get('.alert').contains('Successfully signed-up');

    cy.get('#user-dropdown').click();

    cy.get('.cursor-pointer').click();

    // repeat
  });
});
