import React, { FC } from 'react';
import { Switch, useLocation } from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';

type RoutesProps = {
  exitBeforeEnter?: boolean;
  initial?: boolean;
};

const AnimatedRoutes: FC<RoutesProps> = ({
  children,
  exitBeforeEnter = true,
  initial = false,
}) => {
  const location = useLocation();
  return (
    <AnimatePresence exitBeforeEnter={exitBeforeEnter} initial={initial}>
      <Switch location={location} key={location.pathname}>
        {children}
      </Switch>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
