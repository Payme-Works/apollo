import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';

import IProfile from '@/interfaces/account/IProfile';
import { logIn as doLogIn } from '@/services/ares/account/LogInService';

interface AuthenticationContext {
  profile?: IProfile;
  isLoggedIn: boolean;
  isLoggingIn: boolean;
  logIn(): Promise<void>;
}

const AuthenticationContext = createContext<AuthenticationContext | null>(null);

const AuthenticationProvider: React.FC = ({ children }) => {
  const [profile, setProfile] = useState<IProfile>();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const logIn = useCallback(async () => {
    setIsLoggingIn(true);

    const loggedInProfile = await doLogIn({
      email: String(process.env.IQ_OPTION_ACCOUNT_EMAIL),
      password: String(process.env.IQ_OPTION_ACCOUNT_PASSWORD),
      balance: 'practice',
    });

    setProfile(loggedInProfile);
    setIsLoggingIn(false);
  }, []);

  const isLoggedIn = useMemo(() => !!profile, [profile]);

  return (
    <AuthenticationContext.Provider
      value={{ profile, isLoggedIn, isLoggingIn, logIn }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

function useAuthentication(): AuthenticationContext {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error(
      "'useAuthentication' must be used within a 'AuthenticationProvider'",
    );
  }

  return context;
}

export { AuthenticationProvider, useAuthentication };
