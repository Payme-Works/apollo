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
          M1;02:37;EURJPY-OTC;PUT
          M1;05:12;USDJPY-OTC;CALL
          M1;06:57;EURGBP-OTC;CALL
          M1;08:37;EURJPY-OTC;PUT
          M1;09:37;AUDCAD-OTC;PUT️
          M1;13:32;AUDCAD-OTC;CALL
          M1;16:52;EURJPY-OTC;CALL
          M5;00:35;EURUSD-OTC;PUT
          M5;01:00;NZDUSD-OTC;PUT️
          M5;02:35;EURJPY-OTC;PUT
          M5;04:45;USDCHF-OTC;PUT
          M5;05:10;USDJPY-OTC;CALL️
          M5;05:15;EURUSD-OTC;CALL️
          M5;06:55;EURGBP-OTC;CALL
          M5;07:25;USDCHF-OTC;PUT
          M5;08:15;EURJPY-OTC;PUT
          M5;08:30;USDJPY-OTC;CALL️
          M5;09:35;AUDCAD-OTC;PUT
          M5;10:55;EURGBP-OTC;CALL️
          M5;11:55;EURGBP-OTC;CALL️
          M5;13:30;AUDCAD-OTC;CALL
          M5;15:55;EURJPY-OTC;PUT
          M5;16:50;EURJPY-OTC;CALL
          M5;17:10;USDJPY-OTC;CALL
          M5;17:30;EURJPY-OTC;CALL
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
