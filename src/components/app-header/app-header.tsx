import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectIsAuthenticated, selectUser } from '@selectors';

export const AppHeader: FC = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <AppHeaderUI userName={user?.name} isAuthenticated={isAuthenticated} />
  );
};
