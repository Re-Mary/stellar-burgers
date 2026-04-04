import { describe, expect, it } from '@jest/globals';

import {
  addIngredient,
  clearConstructor,
  constructorReducer,
  moveIngredient,
  removeIngredient
} from '../../slices/constructorSlice';
import {
  mockBun,
  mockMainIngredient,
  mockSauceIngredient
} from '../../../utils/mock-data';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-12345')
}));

describe('burgerConstructor (constructorSlice)', () => {
  describe('addIngredient', () => {
    it('добавляет булку и заменяет предыдущую', () => {
      const prev = {
        bun: { ...mockBun, _id: 'old' },
        ingredients: []
      };

      const next = constructorReducer(prev, addIngredient(mockBun));

      expect(next.bun).toEqual(mockBun);
      expect(next.ingredients).toEqual([]);
    });

    it('добавляет основной ингредиент с уникальным id (prepare)', () => {
      const prev = { bun: null, ingredients: [] };

      const next = constructorReducer(prev, addIngredient(mockMainIngredient));

      expect(next.bun).toBeNull();
      expect(next.ingredients).toHaveLength(1);
      expect(next.ingredients[0]).toEqual({
        ...mockMainIngredient,
        id: 'test-uuid-12345'
      });
    });

    it('добавляет соус в начинку', () => {
      const prev = { bun: null, ingredients: [] };

      const next = constructorReducer(prev, addIngredient(mockSauceIngredient));

      expect(next.ingredients).toHaveLength(1);
      expect(next.ingredients[0]).toEqual({
        ...mockSauceIngredient,
        id: 'test-uuid-12345'
      });
    });
  });

  describe('removeIngredient', () => {
    it('удаляет ингредиент по id', () => {
      const prev = {
        bun: null,
        ingredients: [
          { ...mockMainIngredient, id: 'id-1' },
          { ...mockSauceIngredient, id: 'id-2' },
          { ...mockMainIngredient, id: 'id-3' }
        ]
      };

      const next = constructorReducer(prev, removeIngredient('id-2'));

      expect(next.ingredients).toHaveLength(2);
      expect(next.ingredients[0].id).toBe('id-1');
      expect(next.ingredients[1].id).toBe('id-3');
    });

    it('не меняет список, если id не найден', () => {
      const prev = {
        bun: null,
        ingredients: [{ ...mockMainIngredient, id: 'id-1' }]
      };

      const next = constructorReducer(prev, removeIngredient('missing'));

      expect(next.ingredients).toEqual(prev.ingredients);
    });
  });

  describe('moveIngredient', () => {
    const setup = () => [
      { ...mockMainIngredient, id: 'id-1' },
      { ...mockSauceIngredient, id: 'id-2' },
      { ...mockMainIngredient, id: 'id-3' }
    ];

    it('перемещает ингредиент по индексам (вниз в списке)', () => {
      const prev = { bun: null, ingredients: setup() };

      const next = constructorReducer(
        prev,
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      );

      expect(next.ingredients.map((i) => i.id)).toEqual([
        'id-2',
        'id-3',
        'id-1'
      ]);
    });

    it('перемещает ингредиент по индексам (вверх в списке)', () => {
      const prev = { bun: null, ingredients: setup() };

      const next = constructorReducer(
        prev,
        moveIngredient({ fromIndex: 2, toIndex: 0 })
      );

      expect(next.ingredients.map((i) => i.id)).toEqual([
        'id-3',
        'id-1',
        'id-2'
      ]);
    });
  });

  describe('clearConstructor', () => {
    it('сбрасывает конструктор к пустому состоянию', () => {
      const prev = {
        bun: mockBun,
        ingredients: [{ ...mockMainIngredient, id: 'x' }]
      };

      const next = constructorReducer(prev, clearConstructor());

      expect(next.bun).toBeNull();
      expect(next.ingredients).toEqual([]);
    });
  });
});
