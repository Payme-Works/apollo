export type Expiration = 'm1' | 'm5' | 'm15' | 'm30' | 'h1';

export type Action = 'call' | 'put';

export default interface ISignal {
  id: string;
  active: string;
  date: Date;
  action: Action;
  expiration: Expiration;
}
