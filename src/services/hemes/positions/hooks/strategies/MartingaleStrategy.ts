import {
  getFixedTimestamp,
  getPositionResult,
  Position,
  PositionResult,
} from '@hemes/iqoption';
import { subSeconds } from 'date-fns';

import { ClosedPosition } from '@/interfaces/positions/ClosedPosition';
import {
  openPosition,
  OpenPositionResponse,
} from '@/services/hemes/positions/OpenPositionService';

import { UsePositionHook } from '../UsePositionHook';

interface OnLossAndOpenNextMartingalePositionPayload {
  martingale: number;
  profit: number;
  result: PositionResult;
  next: {
    price: number;
    setPrice(newPrice: number): void;
  };
  cancel(): void;
}

interface OpenMartingalePositionPayload {
  open_position_response: OpenPositionResponse;
}

export function useMartingaleStrategy(
  max: number,
  payout: number,
  price: number,
  onLossAndOpenNextMartingalePosition?: (
    payload: OnLossAndOpenNextMartingalePositionPayload,
  ) => void,
  onOpenMartingalePosition?: (payload: OpenMartingalePositionPayload) => void,
  _current = 0,
  _profit = 0,
): UsePositionHook<ClosedPosition> {
  return (hemes, { position_id, open_position }) =>
    new Promise(async (resolve, reject) => {
      try {
        const [position] = open_position.response;

        const positionExpirationa = Number(
          position.raw_event.expiration_time ||
            position.raw_event.instrument_expiration,
        );
        const positionExpirationDate = getFixedTimestamp(positionExpirationa);

        const beforeExpiration = subSeconds(positionExpirationDate, 1);

        const timeout = beforeExpiration.getTime() - Date.now();

        setTimeout(async () => {
          let result: PositionResult = 'win';

          const positionState = await hemes.getPositionState(position.id);

          let closedPosition: Position;

          let priceDifference =
            positionState.open_price - positionState.current_price;

          if (priceDifference < 0) {
            priceDifference *= -1;
          }

          if (
            open_position.data.expiration_period !== 'm1' &&
            priceDifference > 0.0001
          ) {
            result = getPositionResult(
              position.instrument_type,
              position.raw_event.instrument_dir,
              {
                open: positionState.open_price,
                close: positionState.current_price,
              },
            );
          } else {
            closedPosition = await hemes.getPosition(position_id, {
              status: 'closed',
            });

            result = getPositionResult(
              closedPosition.instrument_type,
              closedPosition.raw_event.instrument_dir ||
                closedPosition.raw_event.direction,
              {
                open: closedPosition.open_quote,
                close: closedPosition.close_quote,
              },
            );
          }

          if (result === 'loss' && max > 0 && _current < max) {
            const { price: lastPositionPrice } = open_position.data;

            const differencePercentage = payout / 100;

            const calculatedPrice =
              lastPositionPrice / differencePercentage + lastPositionPrice;

            let martingalePrice = calculatedPrice || lastPositionPrice * 2.25;

            let canceled = false;

            if (onLossAndOpenNextMartingalePosition) {
              onLossAndOpenNextMartingalePosition({
                martingale: _current,
                profit: -lastPositionPrice,
                result,
                next: {
                  price: martingalePrice,
                  setPrice(newPrice: number) {
                    martingalePrice = newPrice;
                  },
                },
                cancel() {
                  canceled = true;
                },
              });
            }

            if (canceled) {
              if (!closedPosition) {
                closedPosition = await hemes.getPosition(position_id, {
                  status: 'closed',
                });
              }

              resolve({
                result,
                profit: _profit + closedPosition.pnl_realized,
              });

              return;
            }

            let openMartingalePositionResponse: OpenPositionResponse;

            try {
              openMartingalePositionResponse = await openPosition(hemes, {
                ...open_position.data,
                price: martingalePrice,
              });
            } catch (err) {
              reject(err);

              return;
            }

            if (onOpenMartingalePosition) {
              onOpenMartingalePosition({
                open_position_response: openMartingalePositionResponse,
              });
            }

            if (!closedPosition) {
              closedPosition = await hemes.getPosition(position_id, {
                status: 'closed',
              });
            }

            const [, useMartingalePositionHook] =
              openMartingalePositionResponse;

            const martingaleResult = useMartingalePositionHook(
              useMartingaleStrategy(
                max,
                payout,
                price,
                onLossAndOpenNextMartingalePosition,
                onOpenMartingalePosition,
                _current + 1,
                _profit + closedPosition.pnl_realized,
              ),
            );

            resolve(martingaleResult);
          } else {
            if (!closedPosition) {
              closedPosition = await hemes.getPosition(position_id, {
                status: 'closed',
              });

              result = getPositionResult(
                closedPosition.instrument_type,
                closedPosition.raw_event.instrument_dir ||
                  closedPosition.raw_event.direction,
                {
                  open: closedPosition.open_quote,
                  close: closedPosition.close_quote,
                },
              );
            }

            resolve({
              result,
              profit: _profit + closedPosition.pnl_realized,
            });
          }
        }, timeout);
      } catch (err) {
        reject(err);
      }
    });
}
