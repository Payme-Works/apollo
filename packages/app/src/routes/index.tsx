import '../animation/styles.css';
import React from 'react';
import { Switch, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Home from '@/screens/Home';
import Settings from '@/screens/Settings';
import SignIn from '@/screens/SignIn';

import Route from './Route';
import { Container } from './styles';

const Routes: React.FC = () => {
  const location = useLocation();

  return (
    <Container>
      <TransitionGroup>
        <CSSTransition key={location.key} classNames="fade" timeout={300}>
          <Switch>
            <Route path="/" exact component={SignIn} />

            <Route path="/app" component={Home} isPrivate />
            <Route path="/settings" component={Settings} isPrivate />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </Container>
  );
};

export default Routes;
