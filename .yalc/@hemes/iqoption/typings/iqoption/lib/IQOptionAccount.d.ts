import { AxiosInstance } from 'axios';
import { Active, BalanceMode, BaseIQOptionAccount, Candle, ExpirationPeriod, InstrumentType, OpenBinaryOption, PlaceDigitalOption, Profile } from './types';
import { Position } from './websocket/events/responses/PositionChanged';
import { WebSocketClient } from './websocket/WebSocketClient';
export declare class IQOptionAccount implements BaseIQOptionAccount {
    api: AxiosInstance;
    webSocket: WebSocketClient;
    private activeBalance?;
    constructor(api: AxiosInstance, webSocket: WebSocketClient);
    getProfile(): Promise<Profile>;
    setBalanceMode(mode: BalanceMode): Promise<void>;
    getActiveProfit<Type extends InstrumentType>(active: Active, instrumentType: Type, ...expirationPeriod: Type extends 'binary-option' ? [ExpirationPeriod] : []): Promise<number>;
    isActiveEnabled<Type extends InstrumentType>(active: Active, instrumentType: Type, ...expirationPeriod: Type extends 'binary-option' ? [ExpirationPeriod] : []): Promise<boolean>;
    placeDigitalOption({ active, direction, expiration_period, price, }: PlaceDigitalOption): Promise<Position>;
    openBinaryOption({ active, direction, expiration_period, price, }: OpenBinaryOption): Promise<Position>;
    getPosition(positionId: string): Promise<Position>;
    getCandles(active: Active, timePeriod: ExpirationPeriod, count: number, toDate?: Date | number): Promise<Candle[]>;
}
//# sourceMappingURL=IQOptionAccount.d.ts.map