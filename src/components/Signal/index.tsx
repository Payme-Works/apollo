import React, { useContext, useMemo } from 'react';

import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { FiAlertCircle } from 'react-icons/fi';
import { ThemeContext } from 'styled-components';
import { v4 as uuid } from 'uuid';

import galeImg from '@/assets/gale.png';
import { Tooltip } from '@/components/Tooltip';
import { useSignals } from '@/context/SignalsContext';
import { useConfig } from '@/hooks/useConfig';
import { SignalWithStatus } from '@/interfaces/signals/SignalWithStatus';
import { formatPrice } from '@/utils/formatPrice';

import { Container, Label, GaleImage } from './styles';

interface ISignalProps {
  data: SignalWithStatus;
  onCancel(): void;
  onResume(): void;
}

export function Signal({ data, onCancel, onResume }: ISignalProps) {
  const theme = useContext(ThemeContext);

  const { isSignalAvailable, hasSignalResult } = useSignals();

  const [
    {
      current: { application },
    },
  ] = useConfig('robot');

  const formattedData = useMemo(() => {
    const dateUTC = new Date(data.date);
    const toZoneDate = utcToZonedTime(dateUTC, application.timezone.value);

    return {
      date: format(toZoneDate, 'HH:mm'),
      currency: data.active.toUpperCase(),
      expiration: data.expiration.toUpperCase(),
      operation: data.direction.toUpperCase(),
    };
  }, [application.timezone.value, data]);

  const isAvailable = useMemo(
    () => isSignalAvailable(data) && !hasSignalResult(data),
    [isSignalAvailable, data, hasSignalResult],
  );

  const activeLabelWidth = useMemo(
    () => (data.active.includes('OTC') ? theme.sizes[32] : theme.sizes[20]),
    [data.active, theme.sizes],
  );

  const shouldShowMartingales = useMemo(
    () => data.status !== 'loss' && data.result?.martingales > 0,
    [data.result, data.status],
  );

  const formattedProfit = useMemo(
    () => formatPrice(data.result?.profit),
    [data.result?.profit],
  );

  return (
    <Container status={data.status}>
      <div>
        <Label width={theme.sizes[14]}>{formattedData.date}</Label>

        <Label width={activeLabelWidth}>{formattedData.currency}</Label>

        <Label width={theme.sizes[10]}>{formattedData.expiration}</Label>

        <Label width={theme.sizes[10]}>{formattedData.operation}</Label>

        {data.info && (
          <Tooltip style={{ marginLeft: theme.spaces[4] }} text={data.info}>
            <FiAlertCircle
              color={theme.colors.foreground['accent-2']}
              size={theme.sizes[5]}
              strokeWidth={1}
            />
          </Tooltip>
        )}

        {shouldShowMartingales &&
          [...Array(data.result?.martingales)].map((_item, index) => (
            <GaleImage key={uuid()} alt={`Gale ${index + 1}`} src={galeImg} />
          ))}
      </div>

      {isAvailable ? (
        <>
          {data.status === 'canceled' ? (
            <button onClick={onResume} type="button">
              Retomar
            </button>
          ) : (
            <button onClick={onCancel} type="button">
              Cancelar
            </button>
          )}
        </>
      ) : (
        <>{data.result?.profit && <span>{formattedProfit}</span>}</>
      )}
    </Container>
  );
}

export default Signal;
