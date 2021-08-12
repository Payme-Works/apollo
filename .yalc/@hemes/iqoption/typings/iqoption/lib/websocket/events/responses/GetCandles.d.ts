import { Candle } from 'packages/iqoption/lib/types';
import { Response } from '../Response';
export interface CandlesResponse {
    candles: Candle[];
}
export declare class GetCandlesResponse extends Response<CandlesResponse> {
    get name(): string;
}
//# sourceMappingURL=GetCandles.d.ts.map