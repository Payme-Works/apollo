import React from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';

import { useAuthentication } from '@/context/authentication';

interface IRouteProps extends ReactDOMRouteProps {
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
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === isLoggedIn ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/app',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
