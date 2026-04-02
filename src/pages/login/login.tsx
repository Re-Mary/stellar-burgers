import { FC, SyntheticEvent } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { selectLoginError } from '@selectors';
import { loginUser } from '@slices';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const loginError = useSelector(selectLoginError);
  const errorMessage = loginError ?? '';

  const { values, handleChange } = useForm({ email: '', password: '' });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email: values.email, password: values.password }));
  };

  return (
    <LoginUI
      errorText={errorMessage}
      values={values}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
