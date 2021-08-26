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
  isBefore,
  startOfMinute,
  subSeconds,
  parseISO,
  format,
  isToday,
  isAfter,
  startOfDay,
} from 'date-fns';
import { setMinutes } from 'date-fns/esm';
import { assign } from 'lodash';
import { PartialDeep } from 'type-fest';
import { v4 as uuid } from 'uuid';

import { useWebSocket } from '@/hooks/useWebSocket';
import { KoreSignal, Signal } from '@/interfaces/signals/Signal';
import { SignalWithStatus } from '@/interfaces/signals/SignalWithStatus';
import { getSignalsFromDate } from '@/services/kore/signals/GetSignalsFromDateService';

type UpdateSignalData = PartialDeep<Omit<SignalWithStatus, 'id'>>;

interface SignalsContextData {
  signals: SignalWithStatus[];
  updateSignal(signalId: string, data: UpdateSignalData): void;
  getSignalAvailableDate(signal: SignalWithStatus): Date;
  isSignalAvailable(signal: SignalWithStatus): boolean;
  hasSignalResult(signal: SignalWithStatus): boolean;
}

const DEBUG_SIGNALS = String(process.env.DEBUG_SIGNALS) === 'true';

const SignalsContext = createContext<SignalsContextData>(
  {} as SignalsContextData,
);

export function SignalsContextProvider({ children }) {
  const [signals, setSignals] = useState<SignalWithStatus[]>([]);
  const [dateForSignals, setDateForSignals] = useState<Date>(
    startOfDay(Date.now()),
  );

  const formattedDate = useMemo(
    () => format(dateForSignals, 'yyyy-M-d'),
    [dateForSignals],
  );

  if (!DEBUG_SIGNALS) {
    useWebSocket(`signals:premium:${formattedDate}`, socket => {
      socket.on('new', (newSignals: KoreSignal[]) => {
        const mapNewSignals = newSignals.map<SignalWithStatus>(signal => ({
          id: signal.id,
          active: signal.currency.replace('/', '') as any,
          date: signal.date,
          direction: signal.operation,
          expiration: signal.expiration,
          status: 'waiting',
        }));

        if (isToday(dateForSignals)) {
          setSignals(state => [...state, ...mapNewSignals]);
        } else {
          setSignals(mapNewSignals);
        }
      });

      socket.on('update', (newSignal: KoreSignal) => {
        setSignals(state => {
          const newSignals = [...state];

          const signalIndex = newSignals.findIndex(
            signal => signal.id === newSignal.id,
          );

          newSignals[signalIndex] = {
            ...assign(newSignals[signalIndex], {
              id: newSignal.id,
              active: newSignal.currency.replace('/', '') as any,
              date: newSignal.date,
              direction: newSignal.operation,
              expiration: newSignal.expiration,
            }),
          };

          return newSignals;
        });
      });
    });
  }

  useEffect(() => {
    async function loadSignals() {
      async function getSignals(date: Date): Promise<Signal[]> {
        const data = {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        };

        const [m1, m5, m15, m30, h1] = await Promise.all([
          getSignalsFromDate({ ...data, expiration: 'm1' }),
          getSignalsFromDate({ ...data, expiration: 'm5' }),
          getSignalsFromDate({ ...data, expiration: 'm15' }),
          getSignalsFromDate({ ...data, expiration: 'm30' }),
          getSignalsFromDate({ ...data, expiration: 'h1' }),
        ]);

        const joinSignals = [...m1, ...m5, ...m15, ...m30, ...h1];

        return joinSignals;
      }

      if (!DEBUG_SIGNALS) {
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

        const newSignals = signalsFromDate.map<SignalWithStatus>(signal => ({
          ...signal,
          status: 'waiting',
        }));

        setSignals(newSignals);
        setDateForSignals(date);
      } else {
        setSignals([
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(setMinutes(Date.now(), 15)).toISOString(),
            expiration: 'm5',
            direction: 'call',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(setMinutes(Date.now(), 35)).toISOString(),
            expiration: 'm5',
            direction: 'call',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(setMinutes(Date.now(), 55)).toISOString(),
            expiration: 'm5',
            direction: 'call',
            status: 'waiting',
          },
          /* {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(addMinutes(Date.now(), 2)).toISOString(),
            expiration: 'm1',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(addMinutes(Date.now(), 3)).toISOString(),
            expiration: 'm1',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(addMinutes(Date.now(), 4)).toISOString(),
            expiration: 'm1',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(addMinutes(Date.now(), 5)).toISOString(),
            expiration: 'm1',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(addMinutes(Date.now(), 6)).toISOString(),
            expiration: 'm1',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(addMinutes(Date.now(), 7)).toISOString(),
            expiration: 'm1',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(addMinutes(Date.now(), 8)).toISOString(),
            expiration: 'm1',
            direction: 'call',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(addMinutes(Date.now(), 9)).toISOString(),
            expiration: 'm1',
            direction: 'put',
            status: 'waiting',
          }, */
        ]);
      }
    }

    loadSignals();
  }, []);

  const updateSignal = useCallback(
    (signalId: string, data: UpdateSignalData) => {
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
    (signal: SignalWithStatus): Date => subSeconds(parseISO(signal.date), 40),
    [],
  );

  const isSignalAvailable = useCallback(
    (signal: SignalWithStatus): boolean =>
      isBefore(Date.now(), subSeconds(parseISO(signal.date), 40)),
    [],
  );

  const hasSignalResult = useCallback(
    (signal: SignalWithStatus) =>
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
}

export function useSignals(): SignalsContextData {
  const context = useContext(SignalsContext);

  if (!context) {
    throw new Error(
      "'useSignals' must be used within a 'SignalsContextProvider'",
    );
  }

  return context;
}
