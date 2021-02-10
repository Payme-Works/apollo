import React, { FC } from 'react';
import { Route } from 'react-router-dom';

import { useAuthentication } from '@/context/authentication';
import SignIn from '@/screens/SignIn';

import MountTransition from '../MountTransition';

type Props = {
  exact?: boolean;
  path: string;
  slide?: number;
  slideUp?: number;
  component: React.ComponentType;
  publicRoute: boolean;
};

const RouteTransition: FC<Props> = ({
  component: Component,
  exact = false,
  slide = 0,
  slideUp = 0,
  publicRoute,
  ...rest
}) => {
  const { isLoggedIn } = useAuthentication();

  return (
    <Route
      exact={exact}
      {...rest}
      render={() => {
        return isLoggedIn && !publicRoute ? (
          <MountTransition slide={slide} slideUp={slideUp}>
            <Component />
          </MountTransition>
        ) : (
          <MountTransition slide={slide} slideUp={slideUp}>
            <SignIn />
          </MountTransition>
        );
      }}
    />
  );
};

export default RouteTransition;
