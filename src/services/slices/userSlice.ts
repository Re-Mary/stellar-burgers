import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { clearProfileOrders } from './profileOrdersSlice';

export type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  loginError: string | null;
  registerError: string | null;
  updateUserError: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  loginError: null,
  registerError: null,
  updateUserError: null
};

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    const { getCookie } = await import('../../utils/cookie');
    const token = getCookie('accessToken');
    if (!token) {
      return null;
    }
    try {
      const data = await getUserApi();
      if (data.success && data.user) {
        return data.user;
      }
      return rejectWithValue(null);
    } catch {
      return rejectWithValue(null);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (payload: TLoginData, { rejectWithValue }) => {
    try {
      const data = await loginUserApi(payload);
      if (data.success && data.user) {
        const { setCookie } = await import('../../utils/cookie');
        localStorage.setItem('refreshToken', data.refreshToken);
        setCookie('accessToken', data.accessToken);
        return data.user;
      }
      return rejectWithValue('Ошибка входа');
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Ошибка входа';
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (payload: TRegisterData, { rejectWithValue }) => {
    try {
      const data = await registerUserApi(payload);
      if (data.success && data.user) {
        const { setCookie } = await import('../../utils/cookie');
        localStorage.setItem('refreshToken', data.refreshToken);
        setCookie('accessToken', data.accessToken);
        return data.user;
      }
      return rejectWithValue('Ошибка регистрации');
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Ошибка регистрации';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) => {
    try {
      await logoutApi();
    } catch {
      /* локальный выход выполняем в любом случае */
    }
    const { deleteCookie: delCookie } = await import('../../utils/cookie');
    delCookie('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(clearProfileOrders());
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (payload: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const data = await updateUserApi(payload);
      if (data.success && data.user) {
        return data.user;
      }
      return rejectWithValue('Не удалось сохранить');
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Не удалось сохранить';
      return rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
    },
    clearUpdateError: (state) => {
      state.updateUserError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginError =
          typeof action.payload === 'string' ? action.payload : 'Ошибка входа';
      })
      .addCase(registerUser.pending, (state) => {
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.registerError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerError =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка регистрации';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.updateUserError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserError =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка сохранения';
      });
  }
});

export const { clearUser, clearUpdateError } = userSlice.actions;
export const userReducer = userSlice.reducer;
