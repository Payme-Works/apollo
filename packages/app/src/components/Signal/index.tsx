import React, { useContext, useMemo } from 'react';

import { format, parseISO } from 'date-fns';
import { ThemeContext } from 'styled-components';

import { useSignals } from '@/context/signals';
import ISignalWithStatus from '@/interfaces/signal/ISignalWithStatus';

import { Container, Flex, Label } from './styles';

interface ISignalProps {
  data: ISignalWithStatus;
  onCancel(): void;
  onResume(): void;
}

const Signal: React.FC<ISignalProps> = ({ data, onCancel, onResume }) => {
  const theme = useContext(ThemeContext);

  const { isSignalAvailable, hasSignalResult } = useSignals();

  const formattedData = useMemo(() => {
    return {
      date: format(parseISO(data.date), 'HH:mm'),
      currency: data.currency.toUpperCase(),
      expiration: data.expiration.toUpperCase(),
      operation: data.operation.toUpperCase(),
    };
  }, [data]);

  const isAvailable = useMemo(
    () => [isSignalAvailable(data), !hasSignalResult(data)].every(Boolean),
    [isSignalAvailable, data, hasSignalResult],
  );

  const activeLabelWidth = useMemo(
    () => (data.currency.includes('OTC') ? theme.sizes[32] : theme.sizes[20]),
    [data.currency, theme.sizes],
  );

  return (
    <Container status={data.status}>
      <Flex>
        <Label width={theme.sizes[14]}>{formattedData.date}</Label>
        <Label width={activeLabelWidth}>{formattedData.currency}</Label>
        <Label width={theme.sizes[10]}>{formattedData.expiration}</Label>
        <Label width={theme.sizes[10]}>{formattedData.operation}</Label>
      </Flex>

      {isAvailable && (
        <>
          {data.status === 'canceled' ? (
            <span
              id="action"
              role="button"
              tabIndex={0}
              onKeyPress={onResume}
              onClick={onResume}
            >
              Retomar
            </span>
          ) : (
            <span
              id="action"
              role="button"
              tabIndex={0}
              onKeyPress={onCancel}
              onClick={onCancel}
            >
              Cancelar
            </span>
          )}
        </>
      )}
    </Container>
  );
};

export default Signal;
