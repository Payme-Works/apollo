import React from 'react';

import { motion } from 'framer-motion';

const MountTransition: React.FC = ({ children }) => (
  <motion.div
    exit={{ opacity: 0 }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.1 }}
  >
    {children}
  </motion.div>
);

export default MountTransition;
