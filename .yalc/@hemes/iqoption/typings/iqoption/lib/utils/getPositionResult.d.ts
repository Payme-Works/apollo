import { InstrumentType, PositionDirection } from '../types';
export declare type PositionResult = 'win' | 'loss' | 'equal';
interface Prices {
    open: number;
    close: number;
}
export declare function getPositionResult(instrumentType: InstrumentType, direction: PositionDirection, prices: Prices): PositionResult;
export {};
//# sourceMappingURL=getPositionResult.d.ts.map