import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import {
  constructorReducer,
  feedReducer,
  ingredientsReducer,
  newOrderReducer,
  orderDetailsReducer,
  profileOrdersReducer,
  userReducer
} from './slices';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  newOrder: newOrderReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer,
  user: userReducer,
  orderDetails: orderDetailsReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
