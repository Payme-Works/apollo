import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';

import { Hemes } from '@hemes/core';
import {
  BaseIQOptionAccount,
  BaseIQOptionProvider,
  IQOptionProvider,
} from '@hemes/iqoption';

interface HemesContextData {
  hemes?: BaseIQOptionAccount;
  profit: number;
  isHemesLoggedIn: boolean;
  isHemesLoggingIn: boolean;
  logInHemes(): Promise<void>;
  setProfit: React.Dispatch<React.SetStateAction<number>>;
}

const HemesContext = createContext<HemesContextData>({} as HemesContextData);

export function HemesContextProvider({ children }) {
  const [hemes, setHemes] = useState<BaseIQOptionAccount>();
  const [profit, setProfit] = useState<number>(0);
  const [isHemesLoggingIn, setHemesIsLoggingIn] = useState(false);

  const isHemesLoggedIn = useMemo(() => !!hemes, [hemes]);

  const logInHemes = useCallback(async () => {
    setHemesIsLoggingIn(true);

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
        String(process.env.IQ_OPTION_ACCOUNT_BALANCE_MODE) as any,
      );

      console.log('Hemes:', newHemes);

      setHemes(newHemes);
    } catch (error) {
      console.log(error);
    } finally {
      setHemesIsLoggingIn(false);
    }
  }, []);

  return (
    <HemesContext.Provider
      value={{
        hemes,
        profit,
        isHemesLoggedIn,
        isHemesLoggingIn,
        logInHemes,
        setProfit,
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
