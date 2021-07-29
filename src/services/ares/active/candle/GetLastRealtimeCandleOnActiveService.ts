import { Expiration } from '@/interfaces/signal/ISignal';
import aresApi from '@/services/ares/api';
import getExpirationTime from '@/utils/getExpirationTime';

export type Trend = 'up' | 'down';

interface IRequest {
  active: string;
  expiration: Expiration;
}

interface IGetLastRealtimeCandleOnActive {
  open: number;
  close: number;
  open_at: number;
}

export async function getLastRealtimeCandleOnActive({
  active,
  ...rest
}: IRequest): Promise<IGetLastRealtimeCandleOnActive> {
  const expiration = getExpirationTime(rest.expiration);

  const response = await aresApi.get<IGetLastRealtimeCandleOnActive>(
    `/actives/${active}/candles/realtime`,
    {
      params: {
        expiration,
      },
    },
  );

  return response.data;
}
