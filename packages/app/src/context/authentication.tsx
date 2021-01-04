import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';

import IProfile from '@/interfaces/account/IProfile';
import { getProfile } from '@/services/ares/account/GetProfileService';
import { logIn as doLogIn } from '@/services/ares/account/LogInService';

interface AuthenticationContext {
  profile?: IProfile;
  profit: number;
  isLoggedIn: boolean;
  isLoggingIn: boolean;
  logIn(): Promise<void>;
  refreshProfile(): Promise<void>;
  setProfit: React.Dispatch<React.SetStateAction<number>>;
}

const AuthenticationContext = createContext<AuthenticationContext | null>(null);

const AuthenticationProvider: React.FC = ({ children }) => {
  const [profile, setProfile] = useState<IProfile>();
  const [profit, setProfit] = useState<number>(0);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const isLoggedIn = useMemo(() => !!profile, [profile]);

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

  const refreshProfile = useCallback(async () => {
    const newProfile = await getProfile();

    setProfile(newProfile);
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        profile,
        profit,
        isLoggedIn,
        isLoggingIn,
        logIn,
        refreshProfile,
        setProfit,
      }}
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
