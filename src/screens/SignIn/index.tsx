import React, { useCallback } from 'react';

import { useHistory } from 'react-router-dom';

import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { useHemes } from '@/context/HemesContext';

export function SignIn() {
  const history = useHistory();

  const { logIn } = useAuth();
  const { logInHemes } = useHemes();

  const handleLogIn = useCallback(async () => {
    await logIn();

    await logInHemes();

    history.push('/app');
  }, [history, logIn, logInHemes]);

  return (
    <div>
      <h1>SignIn</h1>

      <Button onClick={handleLogIn}>Entrar</Button>
    </div>
  );
}
