import React from 'react';

import { AuthenticationProvider } from './authentication';
import { RobotProvider } from './robot';
import { SignalsProvider } from './signals';
import { ToastProvider } from './toast';

const AppProvider: React.FC = ({ children }) => {
  return (
    <ToastProvider>
      <AuthenticationProvider>
        <SignalsProvider>
          <RobotProvider>{children}</RobotProvider>
        </SignalsProvider>
      </AuthenticationProvider>
    </ToastProvider>
  );
};

export default AppProvider;
