import { FC, useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectFeedOrders,
  selectIngredients,
  selectOrderDetails,
  selectOrderDetailsError,
  selectOrderDetailsLoading,
  selectProfileOrders
} from '../../services/selectors';
import { clearCurrentOrder, fetchOrderByNumber } from '../../services/slices';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useDispatch();

  const isModal = Boolean(
    (location.state as { background?: unknown } | null)?.background
  );

  const ordersFromFeed = useSelector(selectFeedOrders);
  const ordersFromProfile = useSelector(selectProfileOrders);
  const orderFromApi = useSelector(selectOrderDetails);
  const isOrderLoading = useSelector(selectOrderDetailsLoading);
  const orderLoadError = useSelector(selectOrderDetailsError);
  const ingredients = useSelector(selectIngredients);

  const orderFromLists = useMemo(() => {
    if (!number) {
      return undefined;
    }
    const n = Number(number);
    if (Number.isNaN(n)) {
      return undefined;
    }
    return (
      ordersFromFeed.find((order) => order.number === n) ||
      ordersFromProfile.find((order) => order.number === n)
    );
  }, [number, ordersFromFeed, ordersFromProfile]);

  const orderData = isModal ? orderFromLists ?? orderFromApi : orderFromApi;

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  useEffect(() => {
    if (!number) {
      return;
    }
    const orderNumber = Number(number);
    if (Number.isNaN(orderNumber)) {
      return;
    }

    if (!isModal) {
      dispatch(fetchOrderByNumber(orderNumber));
      return () => {
        dispatch(clearCurrentOrder());
      };
    }

    if (isModal && !orderFromLists) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
    return undefined;
  }, [dispatch, number, isModal, orderFromLists]);

  if (!isOrderLoading && !orderInfo && orderLoadError) {
    return (
      <p className='text text_type_main-medium pt-10 pl-5 text_color_error'>
        {orderLoadError}
      </p>
    );
  }

  if (isOrderLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} isModal={isModal} />;
};
