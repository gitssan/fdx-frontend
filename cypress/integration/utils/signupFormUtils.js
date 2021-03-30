export const quickFillForm = (userModel) => {
  cy.get('input[formControlName="firstName"]').type(userModel.firstName);
  cy.get('input[formControlName="lastName"]').type(userModel.lastName);
  cy.get('input[formControlName="emailAddress"]').type(userModel.emailAddress);
  cy.get('input[formControlName="password"]').type(userModel.password);
  cy.get('input[formControlName="confirmPassword"]').type(userModel.confirmPassword).blur();
};
