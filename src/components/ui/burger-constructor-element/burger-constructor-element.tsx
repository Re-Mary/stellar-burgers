import React, { memo } from 'react';
import {
  ConstructorElement,
  MoveButton
} from '@zlden/react-developer-burger-ui-components';

import styles from './burger-constructor-element.module.css';
import { BurgerConstructorElementUIProps } from './type';

export const BurgerConstructorElementUI = memo<BurgerConstructorElementUIProps>(
  function BurgerConstructorElementUI({
    ingredient,
    index,
    totalItems,
    handleMoveUp,
    handleMoveDown,
    handleClose
  }) {
    return (
      <li className={`${styles.element} mb-4 mr-2`}>
        <MoveButton
          handleMoveDown={handleMoveDown}
          handleMoveUp={handleMoveUp}
          isUpDisabled={index === 0}
          isDownDisabled={index === totalItems - 1}
        />
        <div className={`${styles.element_fullwidth} ml-2`}>
          <ConstructorElement
            text={ingredient.name}
            price={ingredient.price}
            thumbnail={ingredient.image}
            handleClose={handleClose}
          />
        </div>
      </li>
    );
  }
);
