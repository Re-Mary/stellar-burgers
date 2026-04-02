import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getFeedsApi } from '@api';
import { TOrder, TOrdersData } from '@utils-types';

export type TFeedState = TOrdersData & {
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Не удалось загрузить ленту';
      return rejectWithValue(message);
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeedFromSocket: (state, action: PayloadAction<TOrdersData>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка загрузки ленты';
      });
  }
});

export const { setFeedFromSocket } = feedSlice.actions;
export const feedReducer = feedSlice.reducer;

/** Нормализация сообщения WebSocket к данным ленты */
export const parseFeedSocketMessage = (raw: unknown): TOrdersData | null => {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const data = raw as Record<string, unknown>;
  const orders = data.orders;
  if (!Array.isArray(orders)) {
    return null;
  }
  return {
    orders: orders as TOrder[],
    total: typeof data.total === 'number' ? data.total : 0,
    totalToday: typeof data.totalToday === 'number' ? data.totalToday : 0
  };
};
