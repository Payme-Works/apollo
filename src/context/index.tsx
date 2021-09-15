import React from 'react';

import { ProfileContextProvider } from '@/context/ProfileContext';

import { AuthContextProvider } from './AuthContext';
import { HemesContextProvider } from './HemesContext';
import { RobotContextProvider } from './RobotContext';
import { SignalsContextProvider } from './SignalsContext';
import { ToastContextProvider } from './ToastContext';

export function AppProvider({ children }) {
  return (
    <ToastContextProvider>
      <AuthContextProvider>
        <ProfileContextProvider>
          <HemesContextProvider>
            <SignalsContextProvider>
              <RobotContextProvider>{children}</RobotContextProvider>
            </SignalsContextProvider>
          </HemesContextProvider>
        </ProfileContextProvider>
      </AuthContextProvider>
    </ToastContextProvider>
  );
}
