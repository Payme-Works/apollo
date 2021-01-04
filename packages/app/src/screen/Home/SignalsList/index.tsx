import React, { useCallback, useMemo } from 'react';

import { compareAsc, isBefore } from 'date-fns';

import Signal from '@/components/Signal';
import { ISignalWithStatus, useSignals } from '@/context/signals';

import { Container } from './styles';

const SignalsList: React.FC = () => {
  const { signals, updateSignal } = useSignals();

  const handleToggleSignalStatus = useCallback(
    (signal: ISignalWithStatus, status: 'canceled' | 'waiting') => {
      if (signal.status !== 'waiting' && signal.status !== 'canceled') {
        return;
      }

      if (isBefore(signal.date.getTime(), Date.now())) {
        updateSignal(signal.id, { status: 'passed' });
        return;
      }

      updateSignal(signal.id, { status });
    },
    [updateSignal],
  );

  const sortedSignals = useMemo(
    () => signals.sort((a, b) => compareAsc(a.date, b.date)),
    [signals],
  );

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
