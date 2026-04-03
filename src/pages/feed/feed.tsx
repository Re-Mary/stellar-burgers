import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';
import { fetchFeeds, parseFeedSocketMessage, setFeedFromSocket } from '@slices';
import { useDispatch, useSelector } from '../../services/store';
import { selectFeed, selectFeedOrders } from '@selectors';
import { getPublicFeedWsUrl } from '../../utils/ws';
import { FC } from 'react';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(selectFeed);
  const orders = useSelector(selectFeedOrders);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  useEffect(() => {
    const url = getPublicFeedWsUrl();
    if (!url || !/^wss?:\/\//i.test(url)) {
      return;
    }
    const ws = new WebSocket(url);
    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data as string);
        const data = parseFeedSocketMessage(parsed);
        if (data) {
          dispatch(setFeedFromSocket(data));
        }
      } catch {
        /* игнорируем некорректные сообщения */
        console.log('We ignore this message');
      }
    };
    return () => {
      ws.close();
    };
  }, [dispatch]);

  const showLoader = isLoading && orders.length === 0;

  if (showLoader) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
