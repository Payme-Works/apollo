import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { Active } from '@hemes/iqoption';
import {
  addDays,
  isBefore,
  startOfMinute,
  subSeconds,
  parseISO,
  format,
  isAfter,
  startOfDay,
  addHours,
  addMinutes,
  parse,
} from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { setMinutes } from 'date-fns/esm';
import { assign } from 'lodash';
import { PartialDeep } from 'type-fest';
import { v4 as uuid } from 'uuid';

import { Direction, Expiration, Signal } from '@/interfaces/signals/Signal';
import { SignalWithStatus } from '@/interfaces/signals/SignalWithStatus';

export type UpdateSignalData = PartialDeep<Omit<SignalWithStatus, 'id'>>;

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

  const _formattedDate = useMemo(
    () => format(dateForSignals, 'yyyy-M-d'),
    [dateForSignals],
  );

  // if (!DEBUG_SIGNALS) {
  //   useWebSocket(`signals:premium:${formattedDate}`, socket => {
  //     socket.on('new', (newSignals: KoreSignal[]) => {
  //       const mapNewSignals = newSignals.map<SignalWithStatus>(signal => ({
  //         id: signal.id,
  //         active: signal.currency.replace('/', '') as any,
  //         date: signal.date,
  //         direction: signal.operation,
  //         expiration: signal.expiration,
  //         status: 'waiting',
  //       }));

  //       if (isToday(dateForSignals)) {
  //         setSignals(state => [...state, ...mapNewSignals]);
  //       } else {
  //         setSignals(mapNewSignals);
  //       }
  //     });

  //     socket.on('update', (newSignal: KoreSignal) => {
  //       setSignals(state => {
  //         const newSignals = [...state];

  //         const signalIndex = newSignals.findIndex(
  //           signal => signal.id === newSignal.id,
  //         );

  //         newSignals[signalIndex] = {
  //           ...assign(newSignals[signalIndex], {
  //             id: newSignal.id,
  //             active: newSignal.currency.replace('/', '') as any,
  //             date: newSignal.date,
  //             direction: newSignal.operation,
  //             expiration: newSignal.expiration,
  //           }),
  //         };

  //         return newSignals;
  //       });
  //     });
  //   });
  // }

  useEffect(() => {
    async function loadSignals() {
      async function getSignals(fromDate: Date): Promise<Signal[]> {
        /* const data = {
          year: fromDate.getFullYear(),
          month: fromDate.getMonth() + 1,
          day: fromDate.getDate(),
        };

        const [m1, m5, m15, m30, h1] = await Promise.all([
          getSignalsFromDate({ ...data, expiration: 'm1' }),
          getSignalsFromDate({ ...data, expiration: 'm5' }),
          getSignalsFromDate({ ...data, expiration: 'm15' }),
          getSignalsFromDate({ ...data, expiration: 'm30' }),
          getSignalsFromDate({ ...data, expiration: 'h1' }),
        ]);

        const joinSignals = [...m1, ...m5, ...m15, ...m30, ...h1];

        return joinSignals; */

        const signalsTemplate = `
          M1;03:52;BTCUSD;PUT️
          M1;03:52;USDCAD;CALL
          M1;04:22;GBPUSD;CALL
          M1;05:12;GBPJPY;PUT
          M1;05:27;USDJPY;CALL️
          M1;06:07;AUDJPY;PUT️
          M1;07:32;GBPUSD;PUT️
          M1;08:22;GBPJPY;PUT️
          M1;09:02;GBPJPY;PUT️
          M1;10:47;EURGBP;PUT
          M1;12:47;AUDJPY;PUT️
          M1;13:57;USDCHF;PUT️
          M5;01:05;EURUSD;PUT
          M5;02:05;AUDUSD;PUT️
          M5;02:55;EURGBP;PUT
          M5;03:05;USDJPY;CALL
          M5;04:30;EURUSD;PUT
          M5;05:10;USDJPY;PUT
          M5;06:25;EURUSD;CALL
          M5;06:40;EURUSD;CALL
          M5;07:30;GBPUSD;PUT
          M5;08:20;GBPUSD;PUT️
          M5;08:40;EURGBP;CALL️
          M5;08:55;GBPJPY;PUT
          M5;09:40;EURUSD;CALL️
          M5;09:50;EURUSD;PUT
          M5;11:05;AUDCAD;PUT
          M5;13:00;EURUSD;PUT
          M5;14:35;AUDCAD;PUT
          M5;15:55;EURUSD;PUT
        `;

        const parsedSignals = signalsTemplate
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length)
          .map<Signal>(line => {
            const values = line.trim().replace(/ {2}/g, ' ').split(';');

            const expiration = values[0].toLowerCase() as Expiration;
            const dateSaoPaulo = parse(values[1], 'HH:mm', fromDate);
            const date = zonedTimeToUtc(dateSaoPaulo, 'America/Sao_Paulo');
            const active = values[2] as Active;
            const direction = values[3].toLowerCase() as Direction;

            date.setSeconds(0);

            return {
              id: uuid(),
              active,
              date: date.toISOString(),
              expiration,
              direction,
              status: 'waiting',
            };
          });

        return parsedSignals;
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
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 0), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'call',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 5), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'call',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 10), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 15), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'call',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 20), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 25), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'call',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 30), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 35), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'call',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 40), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 45), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 50), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'call',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 55), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 0), 1),
            ).toISOString(),
            expiration: 'm5',
            direction: 'call',
            status: 'waiting',
          },
          /* {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(addMinutes(Date.now(), 2), 0),
            ).toISOString(),
            expiration: 'm1',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(addMinutes(Date.now(), 3), 0),
            ).toISOString(),
            expiration: 'm1',
            direction: 'put',
            status: 'waiting',
          },

          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(addMinutes(Date.now(), 4), 0),
            ).toISOString(),
            expiration: 'm1',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(addMinutes(Date.now(), 5), 0),
            ).toISOString(),
            expiration: 'm1',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(addMinutes(Date.now(), 6), 0),
            ).toISOString(),
            expiration: 'm1',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(addMinutes(Date.now(), 7), 0),
            ).toISOString(),
            expiration: 'm1',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(addMinutes(Date.now(), 7), 0),
            ).toISOString(),
            expiration: 'm1',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(addMinutes(Date.now(), 8), 0),
            ).toISOString(),
            expiration: 'm1',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(addMinutes(Date.now(), 9), 0),
            ).toISOString(),
            expiration: 'm1',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(addMinutes(Date.now(), 10), 0),
            ).toISOString(),
            expiration: 'm1',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(addMinutes(Date.now(), 11), 0),
            ).toISOString(),
            expiration: 'm1',
            direction: 'put',
            status: 'waiting',
          }, */
          {
            id: uuid(),
            active: 'EURUSD-OTC',
            date: startOfMinute(
              addHours(addMinutes(Date.now(), 60), 0),
            ).toISOString(),
            expiration: 'm1',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 0), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'call',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 5), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'call',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 10), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 15), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'call',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 20), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 25), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'call',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 30), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 35), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'call',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 40), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 45), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 50), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'call',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 55), 0),
            ).toISOString(),
            expiration: 'm5',
            direction: 'put',
            status: 'waiting',
          },
          {
            id: uuid(),
            active: 'EURUSD',
            date: startOfMinute(
              addHours(setMinutes(Date.now(), 0), 1),
            ).toISOString(),
            expiration: 'm5',
            direction: 'call',
            status: 'waiting',
          },
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
    (signal: SignalWithStatus): Date => subSeconds(parseISO(signal.date), 20),
    [],
  );

  const isSignalAvailable = useCallback(
    (signal: SignalWithStatus): boolean =>
      isBefore(Date.now(), subSeconds(parseISO(signal.date), 20)),
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
