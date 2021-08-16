import { Signal, Expiration } from '@/interfaces/signal/ISignal';
import { koreApi } from '@/services/kore/api';

export type Direction = 'up' | 'down';

interface GetSignalsFromDateRequest {
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
}: GetSignalsFromDateRequest): Promise<Signal[]> {
  const response = await koreApi.get<Signal[]>(`/signals/day`, {
    params: {
      year,
      month,
      day,
      expiration: expiration.toLowerCase(),
    },
  });

  return response.data;
}
