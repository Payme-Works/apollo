import React from 'react';

import { Redirect, Route as RouteDOM, RouteProps } from 'react-router-dom';

import { useAuthentication } from '@/context/authentication';

import MountTransition from '../MountTransition';

interface IRouteProps extends RouteProps {
  component: React.ComponentType;
  isPrivate?: boolean;
}

const Route: React.FC<IRouteProps> = ({
  component: Component,
  isPrivate = false,
  ...rest
}) => {
  const { isLoggedIn } = useAuthentication();

  return (
    <RouteDOM
      {...rest}
      render={({ location }) => {
        return isLoggedIn === isPrivate ? (
          <MountTransition>
            <Component />
          </MountTransition>
        ) : (
          <MountTransition>
            <Redirect
              to={{
                pathname: isPrivate ? '/' : '/app',
                state: {
                  from: location,
                },
              }}
            />
          </MountTransition>
        );
      }}
    />
  );
};

export default Route;
