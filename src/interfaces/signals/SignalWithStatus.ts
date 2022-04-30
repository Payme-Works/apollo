import { Signal } from './Signal';

export type Status =
  | 'waiting'
  | 'canceled'
  | 'expired'
  | 'in_progress'
  | 'win'
  | 'loss';

export interface SignalWithStatus extends Signal {
  status: Status;
  info?: string;
  result?: {
    martingales: number;
    profit: number;
  };
  hasEconomicCalendarEvent?: {
    before: number;
    after: number;
  };
}
