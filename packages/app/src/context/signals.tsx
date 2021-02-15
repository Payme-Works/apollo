import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';

import { addMinutes, isBefore, startOfMinute, subSeconds } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import { assign } from 'lodash';
import { PartialDeep } from 'type-fest';
import { v4 as uuid } from 'uuid';

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
      const debugSignals = String(process.env.DEBUG_SIGNALS) === 'true';

      if (!debugSignals) {
        const now = new Date();

        const date = {
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          day: now.getDate(),
        };

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
      } else {
        setSignals([
          {
            id: uuid(),
            currency: 'EUR/USD',
            date: startOfMinute(addMinutes(Date.now(), 1)).toISOString(),
            expiration: 'm1',
            operation: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            currency: 'EUR/USD-OTC',
            date: startOfMinute(addMinutes(Date.now(), 2)).toISOString(),
            expiration: 'm1',
            operation: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            currency: 'EUR/USD',
            date: startOfMinute(addMinutes(Date.now(), 2)).toISOString(),
            expiration: 'm1',
            operation: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            currency: 'EUR/USD',
            date: startOfMinute(addMinutes(Date.now(), 3)).toISOString(),
            expiration: 'm1',
            operation: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            currency: 'EUR/USD',
            date: startOfMinute(addMinutes(Date.now(), 4)).toISOString(),
            expiration: 'm1',
            operation: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            currency: 'EUR/USD',
            date: startOfMinute(addMinutes(Date.now(), 5)).toISOString(),
            expiration: 'm1',
            operation: 'put',
            status: 'waiting',
          },
        ]);
      }
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
