import { FC, SyntheticEvent, useState } from 'react';

import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { selectRegisterError } from '../../services/selectors';
import { registerUser } from '../../services/slices';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const registerError = useSelector(selectRegisterError);
  const errorMessage = registerError ?? '';

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUser({ name: userName, email, password }));
  };

  return (
    <RegisterUI
      errorText={errorMessage}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
