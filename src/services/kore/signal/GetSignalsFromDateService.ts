import ISignal, { Expiration } from '@/interfaces/signal/ISignal';
import koreApi from '@/services/kore/api';

export type Direction = 'up' | 'down';

interface IRequest {
  year: number;
  month: number;
  day: number;
  expiration: Expiration;
}

export async function getSignalsFromDate({
  year,
  month,
  day,
  expiration,
}: IRequest): Promise<ISignal[]> {
  const response = await koreApi.get<ISignal[]>(`/signals/day`, {
    params: {
      year,
      month,
      day,
      expiration: expiration.toLowerCase(),
    },
  });

  return response.data;
}
