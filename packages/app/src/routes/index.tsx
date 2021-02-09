import React from 'react';
import { Switch } from 'react-router-dom';

import Home from '@/screens/Home';
import Settings from '@/screens/Settings';
import SignIn from '@/screens/SignIn';

import Route from './Route';
import { Container } from './styles';

const Routes: React.FC = () => {
  return (
    <Container>
      <Switch>
        <Route path="/" exact component={SignIn} />

        <Route path="/app" component={Home} isPrivate />
        <Route path="/settings" component={Settings} isPrivate />
      </Switch>
    </Container>
  );
};

export default Routes;
