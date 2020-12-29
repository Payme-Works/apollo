import React, { useEffect } from 'react';

import { useAuthentication } from '@/context/authentication';

import Home from './Home';
import { Container } from './styles';

const Screen: React.FC = () => {
  const { isLoggedIn, isLoggingIn, logIn } = useAuthentication();

  useEffect(() => {
    if (isLoggedIn) {
      return;
    }

    logIn();
  }, [isLoggedIn, logIn]);

  return !isLoggingIn ? (
    <Container>
      <Home />
    </Container>
  ) : (
    <div>Logging in...</div>
  );
};

export default Screen;
