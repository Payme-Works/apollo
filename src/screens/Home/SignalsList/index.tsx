import React, { useCallback, useMemo } from 'react';

import { compareAsc, isAfter, compareDesc, parseISO } from 'date-fns';

import { Box } from '@/components/Box';
import { Signal } from '@/components/Signal';
import { useSignals } from '@/context/SignalsContext';
import { SignalWithStatus } from '@/interfaces/signals/SignalWithStatus';

import { Container } from './styles';

export function SignalsList() {
  const { signals, updateSignal, isSignalAvailable, hasSignalResult } =
    useSignals();

  const handleToggleSignalStatus = useCallback(
    (signal: SignalWithStatus, status: 'canceled' | 'waiting') => {
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
    const list: SignalWithStatus[] = [];

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

  const sortedPastSignals = useMemo(() => {
    const list: SignalWithStatus[] = [];

    list.push(
      ...signals
        .sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date)))
        .filter(
          signal =>
            !isSignalAvailable(signal) ||
            (hasSignalResult(signal) && signal.status !== 'expired'),
        ),
    );

    return list;
  }, [hasSignalResult, isSignalAvailable, signals]);

  return (
    <Container>
      <Box
        description="Esses são os movimentos do mercado recomendados pelo Apollo para as próximas horas, "
        footer={{
          hint: 'Caso deseje pausar um movimento especificamente clique no ícone de pausa em cada sinal.',
        }}
        title="Proximos movimentos"
      >
        {sortedSignals.map(signal => (
          <Signal
            key={signal.id}
            data={signal}
            onCancel={() => handleToggleSignalStatus(signal, 'canceled')}
            onResume={() => handleToggleSignalStatus(signal, 'waiting')}
          />
        ))}
      </Box>

      <Box
        description="Movimentos já executados ou com falha serão exibidos abaixo."
        footer={{
          hint: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis, nihil. Rem vitae libero.',
        }}
        title="Histórico de movimentos"
      >
        {sortedPastSignals.map(signal => (
          <Signal
            key={signal.id}
            data={signal}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onCancel={() => {}}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onResume={() => {}}
          />
        ))}
      </Box>
    </Container>
  );
}
