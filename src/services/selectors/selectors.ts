import type { RootState } from '../store';

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;

export const selectNewOrder = (state: RootState) => state.newOrder;

export const selectFeed = (state: RootState) => state.feed;
export const selectFeedOrders = (state: RootState) => state.feed.orders;

export const selectProfileOrders = (state: RootState) =>
  state.profileOrders.orders;
export const selectProfileOrdersLoading = (state: RootState) =>
  state.profileOrders.isLoading;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.user.user);
export const selectLoginError = (state: RootState) => state.user.loginError;
export const selectRegisterError = (state: RootState) =>
  state.user.registerError;
export const selectUpdateUserError = (state: RootState) =>
  state.user.updateUserError;

export const selectOrderDetails = (state: RootState) =>
  state.orderDetails.order;
export const selectOrderDetailsLoading = (state: RootState) =>
  state.orderDetails.isLoading;
export const selectOrderDetailsError = (state: RootState) =>
  state.orderDetails.error;

export const selectIngredientById = (
  state: RootState,
  id: string | undefined
) => {
  if (!id) {
    return undefined;
  }
  return state.ingredients.items.find((item) => item._id === id);
};
