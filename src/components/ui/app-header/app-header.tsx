import React, { FC } from 'react';
import { NavLink, Link } from 'react-router-dom';
import clsx from 'clsx';

import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(styles.link, 'text text_type_main-default ml-2', {
    [styles.link_active]: isActive
  });

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  isAuthenticated
}) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink to='/' className={linkClass} end>
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <span className='ml-2 mr-10'>Конструктор</span>
            </>
          )}
        </NavLink>
        <NavLink to='/feed' className={linkClass}>
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <span className='ml-2'>Лента заказов</span>
            </>
          )}
        </NavLink>
      </div>
      <div className={styles.logo}>
        <Link to='/'>
          <Logo className='' />
        </Link>
      </div>
      <NavLink
        to={isAuthenticated ? '/profile' : '/login'}
        className={clsx(styles.link, styles.link_position_last)}
      >
        {({ isActive }) => (
          <>
            <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
            <span className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </span>
          </>
        )}
      </NavLink>
    </nav>
  </header>
);
