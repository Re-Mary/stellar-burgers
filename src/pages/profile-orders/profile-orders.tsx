import { useEffect } from 'react';

import { ProfileOrdersUI } from '@ui-pages';
import {
  fetchProfileOrders,
  parseProfileOrdersSocketMessage,
  setProfileOrdersFromSocket
} from '../../services/slices';
import { useDispatch, useSelector } from '../../services/store';
import { selectProfileOrders } from '../../services/selectors';
import { getCookie } from '../../utils/cookie';
import { getUserOrdersWsUrl } from '../../utils/ws';
import { FC } from 'react';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  useEffect(() => {
    const token = getCookie('accessToken');
    const url = getUserOrdersWsUrl(token);
    if (!url || !/^wss?:\/\//i.test(url)) {
      return;
    }
    const ws = new WebSocket(url);
    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data as string);
        const next = parseProfileOrdersSocketMessage(parsed);
        if (next) {
          dispatch(setProfileOrdersFromSocket(next));
        }
      } catch {
        /* ignore */
      }
    };
    return () => {
      ws.close();
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
