import { InstrumentType } from '@/interfaces/order/IOrder';
import { Expiration } from '@/interfaces/signal/ISignal';
import aresApi from '@/services/ares/api';
import getExpirationTime from '@/utils/getExpirationTime';

export type Trend = 'up' | 'down';

interface IRequest {
  active: string;
  type: InstrumentType;
  expiration: Expiration;
}

export interface IFindActiveByNameResponse {
  open: boolean;
  profit: number;
  trend: Trend;
}

export async function findActiveByName({
  active,
  type,
  ...rest
}: IRequest): Promise<IFindActiveByNameResponse> {
  const expiration = getExpirationTime(rest.expiration);

  const response = await aresApi.get<IFindActiveByNameResponse>(
    `/actives/${active.replace('/', '')}`,
    {
      params: {
        type,
        expiration,
      },
    },
  );

  return response.data;
}
