import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';

import { isBefore, subSeconds } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import { assign } from 'lodash';
import { PartialDeep } from 'type-fest';

import ISignalWithStatus from '@/interfaces/signal/ISignalWithStatus';
import { getSignalsFromDate } from '@/services/kore/signal/GetSignalsFromDateService';

type IUpdateSignalData = PartialDeep<Omit<ISignalWithStatus, 'id'>>;

interface SignalsContext {
  signals: ISignalWithStatus[];
  updateSignal(signalId: string, data: IUpdateSignalData): void;
  getSignalAvailableDate(signal: ISignalWithStatus): Date;
  isSignalAvailable(signal: ISignalWithStatus): boolean;
  hasSignalResult(signal: ISignalWithStatus): boolean;
}

const SignalsContext = createContext<SignalsContext | null>(null);

const SignalsProvider: React.FC = ({ children }) => {
  const [signals, setSignals] = useState<ISignalWithStatus[]>([]);

  useEffect(() => {
    async function loadSignals() {
      const now = new Date();

      const date = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
      };

      try {
        await getSignalsFromDate({ ...date, expiration: 'm5' });
      } catch (err) {
        console.log({ ...err });
      }

      const [m5, m15, m30, h1] = await Promise.all([
        getSignalsFromDate({ ...date, expiration: 'm5' }),
        getSignalsFromDate({ ...date, expiration: 'm15' }),
        getSignalsFromDate({ ...date, expiration: 'm30' }),
        getSignalsFromDate({ ...date, expiration: 'h1' }),
      ]);

      const joinSignals = [...m5, ...m15, ...m30, ...h1];

      const newSignals = joinSignals.map<ISignalWithStatus>(signal => ({
        ...signal,
        status: 'waiting',
      }));

      setSignals(newSignals);
    }

    loadSignals();
  }, []);

  const updateSignal = useCallback(
    (signalId: string, data: IUpdateSignalData) => {
      const newSignals = [...signals];

      const signalIndex = newSignals.findIndex(
        signal => signal.id === signalId,
      );

      newSignals[signalIndex] = { ...assign(newSignals[signalIndex], data) };

      setSignals(newSignals);
    },
    [signals],
  );

  const getSignalAvailableDate = useCallback(
    (signal: ISignalWithStatus): Date => subSeconds(parseISO(signal.date), 30),
    [],
  );

  const isSignalAvailable = useCallback(
    (signal: ISignalWithStatus): boolean =>
      isBefore(Date.now(), subSeconds(parseISO(signal.date), 30)),
    [],
  );

  const hasSignalResult = useCallback(
    (signal: ISignalWithStatus) =>
      signal.status !== 'waiting' && signal.status !== 'canceled',
    [],
  );

  return (
    <SignalsContext.Provider
      value={{
        signals,
        updateSignal,
        getSignalAvailableDate,
        isSignalAvailable,
        hasSignalResult,
      }}
    >
      {children}
    </SignalsContext.Provider>
  );
};

function useSignals(): SignalsContext {
  const context = useContext(SignalsContext);

  if (!context) {
    throw new Error("'useSignals' must be used within a 'SignalsProvider'");
  }

  return context;
}

export { SignalsProvider, useSignals };
