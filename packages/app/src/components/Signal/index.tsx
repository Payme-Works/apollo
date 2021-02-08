import React, { useContext, useMemo } from 'react';

import { format } from 'date-fns';
import { ThemeContext } from 'styled-components';

import { ISignalWithStatus, useSignals } from '@/context/signals';

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
      date: format(data.date, 'HH:mm'),
      active: data.active.toUpperCase(),
      expiration: data.expiration.toUpperCase(),
      action: data.action.toUpperCase(),
    };
  }, [data]);

  const isAvailable = useMemo(
    () => [isSignalAvailable(data), !hasSignalResult(data)].every(Boolean),
    [isSignalAvailable, data, hasSignalResult],
  );

  const activeLabelWidth = useMemo(
    () => (data.active.includes('OTC') ? theme.sizes[32] : theme.sizes[20]),
    [data.active, theme.sizes],
  );

  return (
    <Container status={data.status}>
      <Flex>
        <Label width={theme.sizes[14]}>{formattedData.date}</Label>
        <Label width={activeLabelWidth}>{formattedData.active}</Label>
        <Label width={theme.sizes[10]}>{formattedData.expiration}</Label>
        <Label width={theme.sizes[10]}>{formattedData.action}</Label>
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
