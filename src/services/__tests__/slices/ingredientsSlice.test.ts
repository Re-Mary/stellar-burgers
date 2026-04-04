import { describe, expect, it, beforeEach } from '@jest/globals';

import {
  fetchIngredients,
  ingredientsReducer
} from '../../slices/ingredientsSlice';
import { mockIngredients } from '../../../utils/mock-data';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('ingredientsSlice', () => {
  const initialState = {
    items: [] as typeof mockIngredients,
    isLoading: false,
    error: null as string | null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchIngredients.pending', () => {
    it('выставляет isLoading в true и сбрасывает ошибку', () => {
      const prev = {
        ...initialState,
        error: 'старая ошибка',
        items: mockIngredients
      };

      const next = ingredientsReducer(prev, {
        type: fetchIngredients.pending.type
      });

      expect(next.isLoading).toBe(true);
      expect(next.error).toBeNull();
      expect(next.items).toEqual(mockIngredients);
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    it('записывает ингредиенты в store и выключает isLoading', () => {
      const prev = { ...initialState, isLoading: true };

      const next = ingredientsReducer(prev, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      });

      expect(next.isLoading).toBe(false);
      expect(next.error).toBeNull();
      expect(next.items).toEqual(mockIngredients);
    });
  });

  describe('fetchIngredients.rejected', () => {
    it('записывает ошибку в store и выключает isLoading', () => {
      const prev = { ...initialState, isLoading: true };

      const next = ingredientsReducer(prev, {
        type: fetchIngredients.rejected.type,
        payload: 'Сеть недоступна'
      });

      expect(next.isLoading).toBe(false);
      expect(next.error).toBe('Сеть недоступна');
      expect(next.items).toEqual([]);
    });
  });
});
