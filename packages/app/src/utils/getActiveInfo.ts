import { Expiration } from '@/interfaces/signal/ISignal';
import {
  IFindActiveByNameResponse,
  findActiveByName,
} from '@/services/ares/active/FindActiveByNameService';

export interface IGetActiveInfoResponse {
  binary: IFindActiveByNameResponse;
  digital: IFindActiveByNameResponse;
}

export default async function getActiveInfo(
  active: string,
  expiration: Expiration,
): Promise<IGetActiveInfoResponse> {
  const [binary, digital] = await Promise.all([
    findActiveByName({
      active,
      type: 'binary',
      expiration,
    }),
    findActiveByName({
      active,
      type: 'digital',
      expiration,
    }),
  ]);

  return {
    binary,
    digital,
  };
}
