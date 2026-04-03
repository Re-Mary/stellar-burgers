import { FC } from 'react';
import { Location, Navigate, Outlet, useLocation } from 'react-router-dom';

import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import {
  selectIsAuthenticated,
  selectIsAuthChecked
} from '../../services/selectors';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false
}) => {
  const isAuth = useSelector(selectIsAuthenticated);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();
  const isModal = Boolean(
    (location.state as { modal?: boolean } | null)?.modal
  );

  if (!isAuthChecked && !isModal) {
    return <Preloader />;
  }

  if (!isAuthChecked && isModal) {
    return null;
  }

  if (onlyUnAuth && isAuth) {
    const from = (location.state as { from?: Location })?.from;
    return <Navigate to={from || '/'} replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Outlet />;
};
