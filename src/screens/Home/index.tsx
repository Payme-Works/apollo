import React from 'react';

import { Profile } from './Profile';
import { SignalsList } from './SignalsList';
import { Status } from './Status';

export function Home() {
  return (
    <>
      <Profile />

      <Status />

      <SignalsList />
    </>
  );
}
