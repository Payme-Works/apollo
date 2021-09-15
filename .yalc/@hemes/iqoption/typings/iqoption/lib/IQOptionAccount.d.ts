import { AxiosInstance } from 'axios';
import { Active, BalanceMode, BaseIQOptionAccount, Candle, ExpirationPeriod, GetPositionOptions, InstrumentType, OpenBinaryOption, PlaceDigitalOption, Profile } from './types';
import { Position } from './websocket/events/responses/PositionChanged';
import { PositionState } from './websocket/events/responses/PositionsState';
import { WebSocketClient } from './websocket/WebSocketClient';
declare type BalanceTypeIds = {
    [type in BalanceMode]: number;
};
export declare const BALANCE_TYPE_IDS: BalanceTypeIds;
export declare class IQOptionAccount implements BaseIQOptionAccount {
    api: AxiosInstance;
    webSocket: WebSocketClient;
    private activeBalance?;
    private openPositionsIds;
    constructor(api: AxiosInstance, webSocket: WebSocketClient);
    getProfile(): Promise<Profile>;
    setBalanceMode(mode: BalanceMode): Promise<void>;
    getActiveProfit<Type extends InstrumentType>(active: Active, instrumentType: Type, ...expirationPeriod: Type extends 'binary-option' ? [ExpirationPeriod] : []): Promise<number>;
    isActiveEnabled<Type extends InstrumentType>(active: Active, instrumentType: Type, ...expirationPeriod: Type extends 'binary-option' ? [ExpirationPeriod] : []): Promise<boolean>;
    private subscribePositionState;
    placeDigitalOption({ active, direction, expiration_period, price, }: PlaceDigitalOption): Promise<Position>;
    openBinaryOption({ active, direction, expiration_period, price, }: OpenBinaryOption): Promise<Position>;
    getPosition(positionId: string, options?: GetPositionOptions): Promise<Position>;
    getPositionState(positionId: string): Promise<PositionState>;
    getCandles(active: Active, expirationPeriod: ExpirationPeriod, count: number, toDate?: Date | number): Promise<Candle[]>;
}
export {};
//# sourceMappingURL=IQOptionAccount.d.ts.map