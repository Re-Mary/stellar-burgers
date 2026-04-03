import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectConstructorItems,
  selectIsAuthenticated,
  selectNewOrder
} from '@selectors';
import { clearOrderModal, submitOrder } from '@slices';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(selectConstructorItems);
  const { orderRequest, orderModalData } = useSelector(selectNewOrder);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const onOrderClick = () => {
    const hasIngredients =
      Boolean(constructorItems.bun) && constructorItems.ingredients.length > 0;

    if (!isAuthenticated && hasIngredients) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || orderRequest) {
      return;
    }

    dispatch(submitOrder());
  };

  const closeOrderModal = () => {
    if (orderRequest) {
      return;
    }
    dispatch(clearOrderModal());
    navigate('/feed');
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
