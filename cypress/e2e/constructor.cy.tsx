/**
 * Интеграционные тесты конструктора.
 */

const selectors = {
  ingredientItem: '[data-testid="ingredient-item"]',
  bunTop: '[data-testid="bun-top"]',
  bunBottom: '[data-testid="bun-bottom"]',
  constructorMainIngredient: '[data-testid="constructor-main-ingredient"]',
  modal: '[data-testid="modal"]',
  modalCloseButton: '[data-testid="modal-close-button"]',
  modalOverlay: '[data-testid="modal-overlay"]',
  orderButton: '[data-testid="order-button"]',
  orderNumber: '[data-testid="order-number"]'
};

const text = {
  bun: 'Краторная булка N-200i',
  main: 'Биокотлета из марсианской Магмы',
  sauce: 'Соус Spicy-X'
};

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.interceptBackend();
    cy.setAuthTokens();
    cy.visit('/');
    cy.wait(['@getIngredients', '@getUser']);
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('добавление ингредиентов из списка в конструктор', () => {
    it('добавляет один ингредиент (начинку) в конструктор', () => {
      cy.contains(text.main)
        .parents(selectors.ingredientItem)
        .find('button')
        .click();

      cy.get(selectors.constructorMainIngredient).should('contain', text.main);
    });

    it('добавляет булку в конструктор (верх и низ)', () => {
      cy.contains(text.bun)
        .parents(selectors.ingredientItem)
        .find('button')
        .click();

      cy.get(selectors.bunTop).should('contain', text.bun);
      cy.get(selectors.bunBottom).should('contain', text.bun);
    });

    it('добавляет соус в конструктор (дополнительная начинка)', () => {
      cy.contains(text.sauce)
        .parents(selectors.ingredientItem)
        .find('button')
        .click();

      cy.get(selectors.constructorMainIngredient).should('contain', text.sauce);
    });
  });

  describe('модальное окно с описанием ингредиента', () => {
    it('открывает модальное окно по клику на ингредиент в списке', () => {
      cy.contains(text.sauce).click();

      cy.get(selectors.modal).should('be.visible');
      cy.get(selectors.modal).should('contain', 'Детали ингредиента');
    });

    it('в модалке отображаются данные именно того ингредиента, по которому кликнули', () => {
      cy.contains(text.main).click();

      cy.get(selectors.modal)
        .should('be.visible')
        .and('contain', text.main)
        .and('contain', '4242');
    });

    it('закрывает модальное окно по клику на крестик', () => {
      cy.contains(text.bun).click();
      cy.get(selectors.modal).should('be.visible');

      cy.get(selectors.modalCloseButton).click();

      cy.get(selectors.modal).should('not.exist');
    });

    it('закрывает модальное окно по клику на оверлей', () => {
      cy.contains(text.bun).click();
      cy.get(selectors.modal).should('be.visible');

      cy.get(selectors.modalOverlay).click({ force: true });

      cy.get(selectors.modal).should('not.exist');
    });
  });

  describe('создание заказа', () => {
    it('собирает бургер, оформляет заказ, показывает верный номер, закрывает модалку и очищает конструктор', () => {
      cy.contains(text.bun)
        .parents(selectors.ingredientItem)
        .find('button')
        .click();

      cy.contains(text.main)
        .parents(selectors.ingredientItem)
        .find('button')
        .click();

      cy.get(selectors.orderButton).find('button').click();

      cy.wait('@createOrder');

      cy.get(selectors.modal).should('be.visible');
      cy.get(selectors.orderNumber).should('contain', '12345');

      cy.get(selectors.modalCloseButton).click();
      cy.wait('@getFeedAll');

      cy.get(selectors.modal).should('not.exist');

      cy.visit('/');
      cy.wait(['@getIngredients', '@getUser']);

      cy.get(selectors.bunTop).should('not.exist');
      cy.get(selectors.bunBottom).should('not.exist');
      cy.get(selectors.constructorMainIngredient).should(
        'contain',
        'Выберите начинку'
      );
    });
  });
});
