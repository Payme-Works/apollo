import React from 'react';

import Profile from './Profile';
import SignalsList from './SignalsList';
import Status from './Status';

const Home: React.FC = () => {
  return (
    <>
      <Profile />

      <Status />
      <SignalsList />
    </>
  );
};

export default Home;
