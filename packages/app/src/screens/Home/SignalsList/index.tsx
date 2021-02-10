import React, { useCallback, useMemo } from 'react';

import { compareAsc, isAfter } from 'date-fns';
import { parseISO } from 'date-fns/esm';

import Signal from '@/components/Signal';
import { useSignals } from '@/context/signals';
import ISignalWithStatus from '@/interfaces/signal/ISignalWithStatus';

import { Container } from './styles';

const SignalsList: React.FC = () => {
  const {
    signals,
    updateSignal,
    isSignalAvailable,
    hasSignalResult,
  } = useSignals();

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

    const sorted = signals.sort((a, b) =>
      compareAsc(parseISO(a.date), parseISO(b.date)),
    );

    list.push(
      ...sorted.filter(
        signal =>
          isSignalAvailable(signal) ||
          (hasSignalResult(signal) && signal.status !== 'expired'),
      ),
    );

    list.push(
      ...sorted.filter(signal => !list.some(item => item.id === signal.id)),
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
};

export default SignalsList;
