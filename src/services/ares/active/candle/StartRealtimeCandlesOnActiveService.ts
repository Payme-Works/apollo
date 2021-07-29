import { Expiration } from '@/interfaces/signal/ISignal';
import aresApi from '@/services/ares/api';
import getExpirationTime from '@/utils/getExpirationTime';

export type Trend = 'up' | 'down';

interface IRequest {
  active: string;
  expiration: Expiration;
}

export async function startRealtimeCandlesOnActive({
  active,
  ...rest
}: IRequest): Promise<void> {
  const expiration = getExpirationTime(rest.expiration);

  await aresApi.post(`/actives/${active}/candles/realtime`, null, {
    params: {
      expiration,
    },
  });
}
