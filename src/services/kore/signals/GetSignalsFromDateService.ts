import { KoreSignal, Expiration, Signal } from '@/interfaces/signals/Signal';
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
  const response = await koreApi.get<KoreSignal[]>(`/signals/day`, {
    params: {
      year,
      month,
      day,
      expiration: expiration.toLowerCase(),
    },
  });

  const mapSignals = response.data.map<Signal>(signal => ({
    id: signal.id,
    active: signal.currency.replace('/', '') as any,
    date: signal.date,
    direction: signal.operation,
    expiration: signal.expiration,
  }));

  return mapSignals;
}
