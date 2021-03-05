import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import {
  addDays,
  addMinutes,
  isBefore,
  startOfMinute,
  subSeconds,
  parseISO,
  format,
  isToday,
  isAfter,
  startOfDay,
} from 'date-fns';
import { assign } from 'lodash';
import { PartialDeep } from 'type-fest';
import { v4 as uuid } from 'uuid';

import useWebSocket from '@/hooks/useWebSocket';
import ISignal from '@/interfaces/signal/ISignal';
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
  const [dateForSignals, setDateForSignals] = useState<Date>(
    startOfDay(Date.now()),
  );

  const formattedDate = useMemo(() => format(dateForSignals, 'yyyy-M-d'), [
    dateForSignals,
  ]);

  useWebSocket(`signals:premium:${formattedDate}`, socket => {
    socket.on('new', (newSignals: ISignal[]) => {
      const mapNewSignals = newSignals.map<ISignalWithStatus>(signal => ({
        ...signal,
        status: 'waiting',
      }));

      if (isToday(dateForSignals)) {
        setSignals(state => [...state, ...mapNewSignals]);
      } else {
        setSignals(mapNewSignals);
      }
    });

    socket.on('update', (newSignal: ISignal) => {
      setSignals(state => {
        const newSignals = [...state];

        const signalIndex = newSignals.findIndex(
          signal => signal.id === newSignal.id,
        );

        newSignals[signalIndex] = {
          ...assign(newSignals[signalIndex], newSignal),
        };

        return newSignals;
      });
    });
  });

  useEffect(() => {
    async function loadSignals() {
      const debugSignals = String(process.env.DEBUG_SIGNALS) === 'true';

      async function getSignals(date: Date): Promise<ISignal[]> {
        const data = {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        };

        const [m5, m15, m30, h1] = await Promise.all([
          getSignalsFromDate({ ...data, expiration: 'm5' }),
          getSignalsFromDate({ ...data, expiration: 'm15' }),
          getSignalsFromDate({ ...data, expiration: 'm30' }),
          getSignalsFromDate({ ...data, expiration: 'h1' }),
        ]);

        const joinSignals = [...m5, ...m15, ...m30, ...h1];

        return joinSignals;
      }

      if (!debugSignals) {
        let date = startOfDay(Date.now());

        let signalsFromDate = await getSignals(date);

        const checkHasRemainingSignalsForToday = signalsFromDate.some(signal =>
          isAfter(parseISO(signal.date), Date.now()),
        );

        if (!checkHasRemainingSignalsForToday) {
          date = addDays(date, 1);

          const signalsFromTomorrow = await getSignals(date);

          if (signalsFromTomorrow.length > 0) {
            signalsFromDate = signalsFromTomorrow;
          }
        }

        const newSignals = signalsFromDate.map<ISignalWithStatus>(signal => ({
          ...signal,
          status: 'waiting',
        }));

        setSignals(newSignals);
        setDateForSignals(date);
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
