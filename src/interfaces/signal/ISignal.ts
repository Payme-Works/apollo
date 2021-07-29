export type Expiration = 'm1' | 'm5' | 'm15' | 'm30' | 'h1';

export type Action = 'call' | 'put';

export default interface ISignal {
  id: string;
  currency: string;
  date: string;
  operation: Action;
  expiration: Expiration;
}
