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

interface BrokerAuthenticationContext {
  profile?: IProfile;
  profit: number;
  isBrokerLoggedIn: boolean;
  isBrokerLoggingIn: boolean;
  logInBroker(): Promise<void>;
  refreshProfile(): Promise<void>;
  setProfit: React.Dispatch<React.SetStateAction<number>>;
}

const BrokerAuthenticationContext =
  createContext<BrokerAuthenticationContext | null>(null);

const BrokerAuthenticationProvider: React.FC = ({ children }) => {
  const [profile, setProfile] = useState<IProfile>();
  const [profit, setProfit] = useState<number>(0);
  const [isBrokerLoggingIn, setIsLoggingIn] = useState(false);

  const isBrokerLoggedIn = useMemo(() => !!profile, [profile]);

  const logInBroker = useCallback(async () => {
    setIsLoggingIn(true);

    const loggedInProfile = await doLogIn({
      email: String(process.env.IQ_OPTION_ACCOUNT_EMAIL),
      password: String(process.env.IQ_OPTION_ACCOUNT_PASSWORD),
      balance: String(process.env.IQ_OPTION_ACCOUNT_BALANCE_MODE) as
        | 'real'
        | 'practice',
    });

    setProfile(loggedInProfile);
    setIsLoggingIn(false);
  }, []);

  const refreshProfile = useCallback(async () => {
    const newProfile = await getProfile();

    setProfile(newProfile);
  }, []);

  return (
    <BrokerAuthenticationContext.Provider
      value={{
        profile,
        profit,
        isBrokerLoggedIn,
        isBrokerLoggingIn,
        logInBroker,
        refreshProfile,
        setProfit,
      }}
    >
      {children}
    </BrokerAuthenticationContext.Provider>
  );
};

function useBrokerAuthentication(): BrokerAuthenticationContext {
  const context = useContext(BrokerAuthenticationContext);

  if (!context) {
    throw new Error(
      "'useBrokerAuthentication' must be used within a 'BrokerAuthenticationProvider'",
    );
  }

  return context;
}

export { BrokerAuthenticationProvider, useBrokerAuthentication };
