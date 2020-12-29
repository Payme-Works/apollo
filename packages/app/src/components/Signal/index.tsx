import React, { useContext, useMemo } from 'react';

import { format, isBefore } from 'date-fns';
import { ThemeContext } from 'styled-components';

import { ISignalWithStatus, Status } from '@/context/signals';

import { Container, Flex, Label } from './styles';

interface ISignalProps {
  data: ISignalWithStatus;
  onCancel(): void;
  onResume(): void;
}

const PASSED_STATUS: Status[] = ['passed', 'in_progress', 'win', 'loss'];

const Signal: React.FC<ISignalProps> = ({ data, onCancel, onResume }) => {
  const theme = useContext(ThemeContext);

  const formattedData = useMemo(() => {
    return {
      date: format(data.date, 'HH:mm'),
      active: data.active.toUpperCase(),
      expiration: data.expiration.toUpperCase(),
      action: data.action.toUpperCase(),
    };
  }, [data]);

  const isPassed = useMemo(() => {
    return (
      PASSED_STATUS.includes(data.status) || isBefore(data.date, new Date())
    );
  }, [data.status, data.date]);

  return (
    <Container status={data.status}>
      <Flex>
        <Label width={theme.sizes[14]}>{formattedData.date}</Label>
        <Label width={theme.sizes[20]}>{formattedData.active}</Label>
        <Label width={theme.sizes[10]}>{formattedData.expiration}</Label>
        <Label width={theme.sizes[10]}>{formattedData.action}</Label>
      </Flex>

      {!isPassed && (
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
