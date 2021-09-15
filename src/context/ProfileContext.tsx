import React, { createContext, useState, useContext } from 'react';

import { BalanceMode } from '@hemes/iqoption';

interface ProfileContextData {
  isProfileLoading: boolean;
  balanceMode: BalanceMode;
  balance: number;
  profit: number;
  setProfileIsLoading(value: boolean): void;
  setBalanceMode(value: BalanceMode): void;
  setBalance(value: number): void;
  setProfit(value: React.SetStateAction<number>): void;
}

const ProfileContext = createContext<ProfileContextData>(
  {} as ProfileContextData,
);

export function ProfileContextProvider({ children }) {
  const [isProfileLoading, setProfileIsLoading] = useState<boolean>(false);
  const [balanceMode, setBalanceMode] = useState<BalanceMode>('practice');
  const [balance, setBalance] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);

  return (
    <ProfileContext.Provider
      value={{
        isProfileLoading,
        balanceMode,
        balance,
        profit,
        setProfileIsLoading,
        setBalanceMode,
        setBalance,
        setProfit,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextData {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error(
      "'useProfile' must be used within a 'ProfileContextProvider'",
    );
  }

  return context;
}
