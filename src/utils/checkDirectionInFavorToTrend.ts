import { PositionDirection } from '@hemes/iqoption';

type Trend = 'up' | 'down';

interface IActionTrends {
  [key: string]: Trend;
}

const ACTIONS_TRENDS: IActionTrends = {
  CALL: 'up',
  PUT: 'down',
};

export function checkDirectionInFavorToTrend(
  direction: PositionDirection,
  trend: Trend,
): boolean {
  if (ACTIONS_TRENDS[direction.toUpperCase()] === trend) {
    return true;
  }

  return false;
}
