import { Active } from '@hemes/iqoption';

export type Expiration = 'm1' | 'm5' | 'm15' | 'm30' | 'h1';

export type Direction = 'call' | 'put';

export interface KoreSignal {
  id: string;
  currency: string;
  date: string;
  operation: Direction;
  expiration: Expiration;
  gales: number;
  premium: boolean;
  result: string;
  created_at: string;
  updated_at: string;
}

export interface Signal {
  id: string;
  active: Active;
  date: string;
  direction: Direction;
  expiration: Expiration;
}
