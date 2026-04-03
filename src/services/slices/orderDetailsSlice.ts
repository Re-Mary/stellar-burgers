import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

type TOrderDetailsState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderDetailsState = {
  order: null,
  isLoading: false,
  error: null
};

type TStateWithLists = {
  feed: { orders: TOrder[] };
  profileOrders: { orders: TOrder[] };
};

export const fetchOrderByNumber = createAsyncThunk(
  'orderDetails/fetchByNumber',
  async (number: number, { getState, rejectWithValue }) => {
    const state = getState() as TStateWithLists;
    const fromFeed = state.feed.orders.find((o) => o.number === number);
    const fromProfile = state.profileOrders.orders.find(
      (o) => o.number === number
    );
    const cached = fromFeed || fromProfile;
    if (cached) {
      return cached;
    }
    try {
      return await getOrderByNumberApi(number);
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Заказ не найден';
      return rejectWithValue(message);
    }
  }
);

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.order = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.order = null;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Не удалось загрузить заказ';
      });
  }
});

export const { clearCurrentOrder } = orderDetailsSlice.actions;
export const orderDetailsReducer = orderDetailsSlice.reducer;
