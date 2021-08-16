import {
  Active,
  BaseIQOptionAccount,
  ExpirationPeriod,
  OpenBinaryOption,
  PlaceDigitalOption,
  Position,
  PositionDirection,
} from '@hemes/iqoption';

import { SimpleInstrumentType } from '@/interfaces/positions/SimpleInstrumentType';

import { UsePositionHook } from './hooks/UsePositionHook';

type UseStrategy = <R = any>(hook: UsePositionHook<R>) => Promise<R>;

export interface OpenPositionRequest {
  instrument_type: SimpleInstrumentType;
  active: Active;
  price: number;
  direction: PositionDirection;
  expiration_period: ExpirationPeriod;
}

export type OpenPositionResponse = [Position, UseStrategy];

export async function openPosition(
  hemes: BaseIQOptionAccount,
  data: OpenPositionRequest,
): Promise<OpenPositionResponse> {
  try {
    const { instrument_type, active, price, direction, expiration_period } =
      data;

    let position: Position;

    const optionData: OpenBinaryOption | PlaceDigitalOption = {
      active,
      price,
      direction,
      expiration_period,
    };

    if (instrument_type === 'binary') {
      position = await hemes.openBinaryOption(optionData as OpenBinaryOption);
    } else if (instrument_type === 'digital') {
      position = await hemes.placeDigitalOption(
        optionData as PlaceDigitalOption,
      );
    }

    const useHook: UseStrategy = <R = any>(
      hook: UsePositionHook<R>,
    ): Promise<R> => {
      return hook(hemes, {
        position_id: position.id,
        open_position: {
          data,
          response: [position, useHook],
        },
      });
    };

    return [position, useHook];
  } catch (err) {
    throw new Error('Occurred an unexpected error while opening position');
  }
}
