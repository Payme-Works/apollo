import React from 'react';

import { AuthenticationProvider } from './authentication';
import { BrokerAuthenticationProvider } from './broker-authentication';
import { RobotProvider } from './robot';
import { SignalsProvider } from './signals';
import { ToastProvider } from './toast';

const AppProvider: React.FC = ({ children }) => {
  return (
    <ToastProvider>
      <AuthenticationProvider>
        <BrokerAuthenticationProvider>
          <SignalsProvider>
            <RobotProvider>{children}</RobotProvider>
          </SignalsProvider>
        </BrokerAuthenticationProvider>
      </AuthenticationProvider>
    </ToastProvider>
  );
};

export default AppProvider;
