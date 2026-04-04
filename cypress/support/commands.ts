import { apiGlobs } from './api-globs';

export {};

/** Моки токенов */
Cypress.Commands.add('setAuthTokens', () => {
  cy.setCookie('accessToken', 'mock-access-token');
  cy.setCookie('refreshToken', 'mock-refresh-token');
  cy.window().then((w) => {
    w.localStorage.setItem('accessToken', 'mock-access-token');
    w.localStorage.setItem('refreshToken', 'mock-refresh-token');
  });
});

/** Все перехваты бэкенда — два аргумента cy.intercept */
Cypress.Commands.add('interceptBackend', () => {
  cy.intercept('GET', apiGlobs.ingredients, {
    fixture: 'ingredients.json'
  }).as('getIngredients');
  cy.intercept('GET', apiGlobs.authUser, { fixture: 'user.json' }).as(
    'getUser'
  );
  cy.intercept('POST', apiGlobs.orders, { fixture: 'order.json' }).as(
    'createOrder'
  );
  cy.intercept('GET', apiGlobs.ordersAll, { fixture: 'feed-all.json' }).as(
    'getFeedAll'
  );
});
