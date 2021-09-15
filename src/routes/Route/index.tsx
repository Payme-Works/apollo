import React from 'react';

import { Redirect, Route as RouteDOM, RouteProps } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';

import { MountTransition } from '../MountTransition';

interface IRouteProps extends RouteProps {
  component: React.ComponentType;
  isPrivate?: boolean;
}

export function Route({
  component: Component,
  isPrivate = false,
  ...rest
}: IRouteProps) {
  const { isLoggedIn } = useAuth();

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
}

export default Route;
