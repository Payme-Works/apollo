import { Action, Expiration } from '@/interfaces/signal/ISignal';

export type InstrumentType = 'binary' | 'digital';

export default interface IOrder {
  type: InstrumentType;
  active: string;
  price_amount: number;
  expiration: Expiration;
  action: Action;
}
