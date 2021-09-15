import { PositionResult } from '@hemes/iqoption';

export interface ClosedPosition {
  result: PositionResult;
  profit: number;
}
