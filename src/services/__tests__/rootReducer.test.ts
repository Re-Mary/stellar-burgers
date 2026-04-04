import { describe, expect, it } from '@jest/globals';

import { rootReducer } from '../store';
import type { RootState } from '../store';

describe('rootReducer', () => {
  it('инициализирует корректное начальное состояние хранилища', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state.ingredients.items).toEqual([]);
    expect(state.ingredients.isLoading).toBe(false);
    expect(state.ingredients.error).toBeNull();

    expect(state.burgerConstructor.bun).toBeNull();
    expect(state.burgerConstructor.ingredients).toEqual([]);

    expect(state.newOrder.orderModalData).toBeNull();
    expect(state.newOrder.orderRequest).toBe(false);

    expect(state.feed.orders).toEqual([]);
    expect(state.profileOrders.orders).toEqual([]);

    expect(state.user.user).toBeNull();
    expect(state.orderDetails.order).toBeNull();
  });

  it('содержит ожидаемый набор ключей верхнего уровня', () => {
    const state = rootReducer(undefined, { type: '@@INIT' }) as RootState;
    expect(Object.keys(state).sort()).toEqual(
      [
        'burgerConstructor',
        'feed',
        'ingredients',
        'newOrder',
        'orderDetails',
        'profileOrders',
        'user'
      ].sort()
    );
  });

  it('не изменяет состояние при неизвестном экшене', () => {
    const initial = rootReducer(undefined, { type: '@@INIT' });
    const next = rootReducer(initial, { type: 'UNKNOWN_ACTION' });

    expect(next).toEqual(initial);
  });
});
