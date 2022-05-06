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
          M1;04:27;GBPUSD;CALL
          M1;05:37;GBPUSD;PUT
          M1;05:47;AUDCAD;PUT
          M1;09:32;AUDJPY;CALL
          M1;10:02;AUDJPY;CALL
          M1;10:37;AUDCAD;CALL
          M1;11:57;AUDJPY;PUT
          M1;14:17;EURGBP;CALL
          M1;14:37;GBPJPY;CALL️
          M1;14:47;AUDCAD;CALL️
          M5;00:50;EURGBP;PUT
          M5;03:10;EURUSD;CALL
          M5;03:20;EURGBP;CALL
          M5;04:15;EURJPY;CALL
          M5;04:35;GBPJPY;PUT️
          M5;05:00;USDCHF;PUT
          M5;05:45;GBPUSD;PUT
          M5;06:05;GBPJPY;CALL
          M5;06:10;EURGBP;PUT
          M5;06:30;AUDUSD;CALL
          M5;07:15;EURCHF;PUT
          M5;07:25;EURGBP;PUT
          M5;07:35;EURUSD;PUT
          M5;10:25;AUDUSD;CALL
          M5;10:50;GBPJPY;CALL
          M5;11:00;AUDCAD;CALL
          M5;11:50;GBPJPY;CALL
          M5;14:00;AUDJPY;PUT
          M5;14:15;EURJPY;CALL
          M5;15:30;AUDJPY;CALL
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
