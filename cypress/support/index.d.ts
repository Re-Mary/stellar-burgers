/// <reference types="cypress" />

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      setAuthTokens(): Chainable<void>;
      interceptBackend(): Chainable<void>;
    }
  }
}
