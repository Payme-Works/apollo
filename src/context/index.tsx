import React from 'react';

import { AuthContextProvider } from './AuthContext';
import { HemesContextProvider } from './HemesContext';
import { RobotContextProvider } from './RobotContext';
import { SignalsContextProvider } from './SignalsContext';
import { ToastContextProvider } from './ToastContext';

export function AppProvider({ children }) {
  return (
    <ToastContextProvider>
      <AuthContextProvider>
        <HemesContextProvider>
          <SignalsContextProvider>
            <RobotContextProvider>{children}</RobotContextProvider>
          </SignalsContextProvider>
        </HemesContextProvider>
      </AuthContextProvider>
    </ToastContextProvider>
  );
}
