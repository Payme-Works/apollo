import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';

import { addMinutes } from 'date-fns';
import { startOfMinute } from 'date-fns/esm';
import { assign } from 'lodash';
import { PartialDeep } from 'type-fest';

import ISignal from '@/interfaces/signal/ISignal';

export type Status =
  | 'waiting'
  | 'passed'
  | 'canceled'
  | 'in_progress'
  | 'win'
  | 'loss';

export interface ISignalWithStatus extends ISignal {
  status: Status;
  warning?: string;
  result?: {
    martingale: number;
    profit: number;
  };
}

type IUpdateSignalData = PartialDeep<Omit<ISignalWithStatus, 'id'>>;

interface SignalsContext {
  signals: ISignalWithStatus[];
  updateSignal(signalId: string, data: IUpdateSignalData): void;
}

const SignalsContext = createContext<SignalsContext | null>(null);

const SignalsProvider: React.FC = ({ children }) => {
  const [signals, setSignals] = useState<ISignalWithStatus[]>([]);

  useEffect(() => {
    setSignals([
      {
        id: 'a879-aaad-9dwa',
        active: 'EURUSD',
        action: 'call',
        date: startOfMinute(addMinutes(new Date(), 2)),
        expiration: 'm1',
        status: 'waiting',
      },
      {
        id: 'a879-d988-9dwa',
        active: 'EURUSD',
        action: 'call',
        date: startOfMinute(addMinutes(new Date(), 3)),
        expiration: 'm1',
        status: 'waiting',
      },
      {
        id: 'a879-awdad-9dwa',
        active: 'EURUSD',
        action: 'put',
        date: startOfMinute(addMinutes(new Date(), 4)),
        expiration: 'm1',
        status: 'waiting',
      },
      {
        id: 'a879-1233-9dwa',
        active: 'EURUSD',
        action: 'call',
        date: startOfMinute(addMinutes(new Date(), 5)),
        expiration: 'm1',
        status: 'waiting',
      },
      {
        id: 'a879-124a-9dwa',
        active: 'EURUSD',
        action: 'call',
        date: startOfMinute(addMinutes(new Date(), 6)),
        expiration: 'm1',
        status: 'waiting',
      },
    ]);
  }, []);

  const updateSignal = useCallback(
    (signalId: string, data: IUpdateSignalData) => {
      const newSignals = [...signals];

      const signalIndex = newSignals.findIndex(
        signal => signal.id === signalId,
      );

      assign(newSignals[signalIndex], data);

      setSignals(newSignals);
    },
    [signals],
  );

  return (
    <SignalsContext.Provider value={{ signals, updateSignal }}>
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
