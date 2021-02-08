import React from 'react';
import { MemoryRouter as Router, Switch } from 'react-router-dom';

import Home from '@/screen/Home';
import Settings from '@/screen/Settings';

import Route from './Route';

const Navigator = () => (
  <Router>
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/settings" component={Settings} />
    </Switch>
  </Router>
);

export default Navigator;
