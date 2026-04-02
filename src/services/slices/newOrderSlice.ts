import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { orderBurgerApi } from '@api';
import { TConstructorIngredient, TIngredient } from '@utils-types';

import { clearConstructor } from './constructorSlice';

type TNewOrderState = {
  orderRequest: boolean;
  orderModalData: { number: number } | null;
  error: string | null;
};

const initialState: TNewOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const submitOrder = createAsyncThunk(
  'newOrder/submit',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as {
      burgerConstructor: {
        bun: TIngredient | null;
        ingredients: TConstructorIngredient[];
      };
    };
    const { bun, ingredients } = state.burgerConstructor;

    if (!bun) {
      return rejectWithValue('Добавьте булку в заказ');
    }

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    try {
      const data = await orderBurgerApi(ingredientIds);
      dispatch(clearConstructor());
      return { number: data.order.number };
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Не удалось оформить заказ';
      return rejectWithValue(message);
    }
  }
);

const newOrderSlice = createSlice({
  name: 'newOrder',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка оформления заказа';
      });
  }
});

export const { clearOrderModal } = newOrderSlice.actions;
export const newOrderReducer = newOrderSlice.reducer;
