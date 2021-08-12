import React, { useCallback, useMemo } from 'react';

import { compareAsc, isAfter, compareDesc, parseISO } from 'date-fns';

import { Signal } from '@/components/Signal';
import { useSignals } from '@/context/SignalsContext';
import { ISignalWithStatus } from '@/interfaces/signal/ISignalWithStatus';

import { Container } from './styles';

export function SignalsList() {
  const { signals, updateSignal, isSignalAvailable, hasSignalResult } =
    useSignals();

  const handleToggleSignalStatus = useCallback(
    (signal: ISignalWithStatus, status: 'canceled' | 'waiting') => {
      if (signal.status !== 'waiting' && signal.status !== 'canceled') {
        return;
      }

      if (isAfter(Date.now(), parseISO(signal.date))) {
        updateSignal(signal.id, { status: 'expired' });

        return;
      }

      updateSignal(signal.id, { status });
    },
    [updateSignal],
  );

  const sortedSignals = useMemo(() => {
    const list: ISignalWithStatus[] = [];

    list.push(
      ...signals
        .sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date)))
        .filter(
          signal =>
            isSignalAvailable(signal) ||
            (hasSignalResult(signal) && signal.status !== 'expired'),
        ),
    );

    list.push(
      ...signals
        .sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)))
        .filter(signal => !list.some(item => item.id === signal.id)),
    );

    return list;
  }, [hasSignalResult, isSignalAvailable, signals]);

  return (
    <Container>
      {sortedSignals.map(signal => (
        <Signal
          key={signal.id}
          data={signal}
          onCancel={() => handleToggleSignalStatus(signal, 'canceled')}
          onResume={() => handleToggleSignalStatus(signal, 'waiting')}
        />
      ))}
    </Container>
  );
}
