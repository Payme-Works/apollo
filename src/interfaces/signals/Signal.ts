import { Active } from '@hemes/iqoption';

export type Expiration = 'm1' | 'm5' | 'm15' | 'm30' | 'h1';

export type Direction = 'call' | 'put';

export interface Signal {
  id: string;
  active: Active;
  date: string;
  direction: Direction;
  expiration: Expiration;
}
