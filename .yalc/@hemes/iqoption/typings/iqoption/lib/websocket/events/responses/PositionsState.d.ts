import { InstrumentType } from '../../../types';
import { Response } from '../Response';
export interface PositionState {
    id: string;
    instrument_type: InstrumentType;
    sell_profit: number;
    margin: number;
    current_price: number;
    quote_timestamp: number;
    pnl: number;
    pnl_net: number;
    open_price: number;
    expected_profit: number;
}
interface PositionsStateMessage {
    expires_in: number;
    positions: PositionState[];
    subscription_id: number;
    user_id: number;
}
export declare class PositionsStateResponse extends Response<PositionsStateMessage> {
    get name(): string;
}
export {};
//# sourceMappingURL=PositionsState.d.ts.map