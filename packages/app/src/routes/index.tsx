import React from 'react';

import Home from '@/screens/Home';
import Settings from '@/screens/Settings';
import SignIn from '@/screens/SignIn';

import AnimatedRoutes from './AnimatedRoutes';
import RouteTransition from './RouteTransition';
import { Container } from './styles';

const Routes: React.FC = () => {
  return (
    <Container>
      <AnimatedRoutes exitBeforeEnter initial={false}>
        <RouteTransition publicRoute component={SignIn} exact path="/" />
        <RouteTransition publicRoute={false} component={Home} path="/app" />
        <RouteTransition
          publicRoute={false}
          component={Settings}
          path="/settings"
        />
      </AnimatedRoutes>
    </Container>
  );
};

export default Routes;
