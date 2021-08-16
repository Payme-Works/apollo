import { Action } from '@/interfaces/signal/ISignal';
import { Trend } from '@/services/ares/active/FindActiveByNameService';

interface IActionTrends {
  [key: string]: Trend;
}

const ACTIONS_TRENDS: IActionTrends = {
  CALL: 'up',
  PUT: 'down',
};

export function checkActionInFavorToTrend(
  action: Action,
  trend: Trend,
): boolean {
  if (ACTIONS_TRENDS[action.toUpperCase()] === trend) {
    return true;
  }

  return false;
}
