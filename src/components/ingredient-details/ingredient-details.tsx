import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import {
  selectIngredientById,
  selectIngredientsLoading
} from '../../services/selectors';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const isLoading = useSelector(selectIngredientsLoading);
  const ingredientData = useSelector((state) =>
    selectIngredientById(state, id)
  );

  if (isLoading && !ingredientData) {
    return <Preloader />;
  }

  if (!isLoading && !ingredientData) {
    return (
      <p className='text text_type_main-medium pt-10 pl-5'>
        Ингредиент не найден
      </p>
    );
  }

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
