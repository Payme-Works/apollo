import React from 'react';
import { Switch, useLocation } from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';

import Home from '@/screens/Home';
import Settings from '@/screens/Settings';
import SignIn from '@/screens/SignIn';

import Route from './Route';

import { Container } from './styles';

const Routes: React.FC = () => {
  const location = useLocation();

  return (
    <Container>
      <AnimatePresence exitBeforeEnter initial={false}>
        <Switch location={location} key={location.pathname}>
          <Route path="/" exact component={SignIn} />

          <Route path="/app" component={Home} isPrivate />
          <Route path="/settings" component={Settings} isPrivate />
        </Switch>
      </AnimatePresence>
    </Container>
  );
};

export default Routes;
