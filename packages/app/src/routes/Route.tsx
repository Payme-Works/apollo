/* eslint-disable no-nested-ternary */

import React from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';

import { useAuthentication } from '@/context/authentication';

interface IRouteProps extends ReactDOMRouteProps {
  component: React.ComponentType;
  path?: string | string[];
}

const Permission: React.FC<IRouteProps> = ({
  component: Component,
  path,
  ...rest
}) => {
  const { isLoggedIn } = useAuthentication();

  return (
    <ReactDOMRoute
      {...rest}
      render={() =>
        isLoggedIn && path === '/' ? <Component /> : <Redirect to="/" />
      }
    />
  );
};

export default Permission;
