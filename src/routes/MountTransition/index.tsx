import React, { ReactNode } from 'react';

import { motion } from 'framer-motion';

interface MountTransitionProps {
  children: ReactNode;
}

export function MountTransition({ children }: MountTransitionProps) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.div>
  );
}
