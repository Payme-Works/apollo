import React from 'react';

import { AnimatePresence } from 'framer-motion';
import { Switch, useLocation } from 'react-router-dom';

import { Home } from '@/screens/Home';
import { Settings } from '@/screens/Settings';
import { SignIn } from '@/screens/SignIn';

import { Route } from './Route';

import { Container } from './styles';

export function Routes() {
  const location = useLocation();

  return (
    <Container>
      <AnimatePresence exitBeforeEnter initial={false}>
        <Switch key={location.pathname} location={location}>
          <Route component={SignIn} exact path="/" />

          <Route component={Home} isPrivate path="/app" />

          <Route component={Settings} isPrivate path="/settings" />
        </Switch>
      </AnimatePresence>
    </Container>
  );
}
