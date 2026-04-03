import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

export type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Не удалось загрузить заказы';
      return rejectWithValue(message);
    }
  }
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    setProfileOrdersFromSocket: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = action.payload;
    },
    clearProfileOrders: (state) => {
      state.orders = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка загрузки заказов';
      });
  }
});

export const { setProfileOrdersFromSocket, clearProfileOrders } =
  profileOrdersSlice.actions;
export const profileOrdersReducer = profileOrdersSlice.reducer;

export const parseProfileOrdersSocketMessage = (
  raw: unknown
): TOrder[] | null => {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const data = raw as Record<string, unknown>;
  if (Array.isArray(data.orders)) {
    return data.orders as TOrder[];
  }
  if (Array.isArray(data.data)) {
    return data.data as TOrder[];
  }
  return null;
};
