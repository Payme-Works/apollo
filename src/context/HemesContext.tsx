import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';

import { Hemes } from '@hemes/core';
import {
  BalanceMode,
  BaseIQOptionAccount,
  BaseIQOptionProvider,
  IQOptionProvider,
} from '@hemes/iqoption';

import { useProfile } from '@/context/ProfileContext';

interface HemesContextData {
  hemes?: BaseIQOptionAccount;
  isHemesLoggedIn: boolean;
  isHemesLoggingIn: boolean;
  logInHemes(): Promise<void>;
  refreshProfile(): Promise<void>;
}

const HemesContext = createContext<HemesContextData>({} as HemesContextData);

export function HemesContextProvider({ children }) {
  const [hemes, setHemes] = useState<BaseIQOptionAccount>();
  const [isHemesLoggingIn, setHemesIsLoggingIn] = useState(false);

  const { setProfileIsLoading, setBalanceMode, setBalance } = useProfile();

  const isHemesLoggedIn = useMemo(() => !!hemes, [hemes]);

  const refreshProfile = useCallback(
    async (hemesAccount: BaseIQOptionAccount = hemes) => {
      setProfileIsLoading(true);

      try {
        const profile = await hemesAccount.getProfile();

        setBalanceMode(profile.balance_type === 1 ? 'real' : 'practice');
        setBalance(profile.balance);
      } finally {
        setProfileIsLoading(false);
      }
    },
    [hemes, setBalance, setBalanceMode, setProfileIsLoading],
  );

  const logInHemes = useCallback(async () => {
    setHemesIsLoggingIn(true);

    setProfileIsLoading(true);

    try {
      const provider = new Hemes(
        IQOptionProvider,
      ).getProvider<BaseIQOptionProvider>();

      provider.enableCorsBypass();

      const newHemes = await provider.logIn({
        email: String(process.env.IQ_OPTION_ACCOUNT_EMAIL),
        password: String(process.env.IQ_OPTION_ACCOUNT_PASSWORD),
      });

      await newHemes.setBalanceMode(
        String(process.env.IQ_OPTION_ACCOUNT_BALANCE_MODE) as BalanceMode,
      );

      console.log('Hemes:', newHemes);

      setHemes(newHemes);

      refreshProfile(newHemes);
    } catch (error) {
      console.log(error);
    } finally {
      setHemesIsLoggingIn(false);
    }
  }, [refreshProfile, setProfileIsLoading]);

  return (
    <HemesContext.Provider
      value={{
        hemes,
        isHemesLoggedIn,
        isHemesLoggingIn,
        logInHemes,
        refreshProfile,
      }}
    >
      {children}
    </HemesContext.Provider>
  );
}

export function useHemes(): HemesContextData {
  const context = useContext(HemesContext);

  if (!context) {
    throw new Error("'useHemes' must be used within a 'HemesContextProvider'");
  }

  return context;
}
