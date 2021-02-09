import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@/components/Button';
import { useAuthentication } from '@/context/authentication';

const SignIn: React.FC = () => {
  const history = useHistory();

  const { logIn } = useAuthentication();

  const handleLogIn = useCallback(async () => {
    await logIn();

    history.push('/app');
  }, [history, logIn]);

  return (
    <div>
      <h1>SignIn</h1>
      <Button onClick={handleLogIn}>Entrar</Button>
    </div>
  );
};

export default SignIn;
