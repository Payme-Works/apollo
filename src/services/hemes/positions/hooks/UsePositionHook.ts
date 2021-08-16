import { BaseIQOptionAccount } from '@hemes/iqoption';

import {
  OpenPositionRequest,
  OpenPositionResponse,
} from '@/services/hemes/positions/OpenPositionService';

export interface PositionHookData {
  position_id: string;
  open_position: {
    data: OpenPositionRequest;
    response: OpenPositionResponse;
  };
}

export type UsePositionHook<R = any> = (
  hemes: BaseIQOptionAccount,
  data: PositionHookData,
) => Promise<R>;
