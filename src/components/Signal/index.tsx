import React, { useContext, useMemo, useState } from 'react';

import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { BsFillPauseFill, BsFillPlayFill } from 'react-icons/bs';
import { FiAlertCircle } from 'react-icons/fi';
import { TiArrowUpThick } from 'react-icons/ti';
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

  const [isHovering, setHovering] = useState(false);

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
    <Container
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      status={data.status}
    >
      <div className="bar">
        <div className="gales">
          {shouldShowMartingales &&
            [...Array(data.result?.martingales)].map((_item, index) => (
              <GaleImage key={uuid()} alt={`Gale ${index + 1}`} src={galeImg} />
            ))}
        </div>

        {data.result ? <span>{formattedProfit}</span> : <span>&nbsp;</span>}
      </div>

      <div>
        <div className="labels">
          <Label width={activeLabelWidth}>
            <h3>
              {`${formattedData.currency.substring(
                0,
                3,
              )}/${formattedData.currency.substring(3, 6)}`}
            </h3>
          </Label>

          <Label width={activeLabelWidth}>{formattedData.date}</Label>

          <Label width={activeLabelWidth}>{formattedData.expiration}</Label>
        </div>

        {/* {formattedData.operation} */}

        <div className="right">
          {!isHovering && (
            <>
              <button type="button">
                <TiArrowUpThick
                  color={
                    formattedData.operation === 'PUT' ? '#22B573' : '#FF6058'
                  }
                  size={theme.sizes[5]}
                  style={
                    formattedData.operation === 'PUT'
                      ? { rotate: '180deg' }
                      : {}
                  }
                />
              </button>
            </>
          )}

          {isAvailable && (
            <>
              {data.status === 'canceled' ? (
                <>
                  {isHovering && (
                    <button onClick={onResume} type="button">
                      <BsFillPlayFill size={theme.sizes[5]} />
                    </button>
                  )}
                </>
              ) : (
                <>
                  {isHovering && (
                    <button onClick={onCancel} type="button">
                      <BsFillPauseFill size={theme.sizes[5]} />
                    </button>
                  )}
                </>
              )}
            </>
          )}

          {isHovering && !isAvailable && data.info && (
            <Tooltip style={{ marginLeft: theme.spaces[4] }} text={data.info}>
              <button type="button">
                <FiAlertCircle
                  color={theme.colors.foreground['accent-2']}
                  size={theme.sizes[5]}
                  strokeWidth={1}
                />
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    </Container>
  );
}

export default Signal;
