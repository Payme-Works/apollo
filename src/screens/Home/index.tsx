import React, { useEffect } from 'react';

import { useBrokerAuthentication } from '@/context/broker-authentication';

import Profile from './Profile';
import SignalsList from './SignalsList';
import Status from './Status';

const Home: React.FC = () => {
  const { isBrokerLoggedIn, isBrokerLoggingIn, logInBroker } =
    useBrokerAuthentication();

  useEffect(() => {
    if (isBrokerLoggedIn) {
      return;
    }

    logInBroker();
  }, [isBrokerLoggedIn, logInBroker]);

  return !isBrokerLoggingIn ? (
    <>
      <Profile />

      <Status />

      <SignalsList />
    </>
  ) : (
    <div>Logging in...</div>
  );
};

export default Home;
