import { ChangeEvent, SyntheticEvent } from 'react';

export type LoginUIProps = {
  errorText: string | undefined;
  values: { email: string; password: string };
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: SyntheticEvent) => void;
};
