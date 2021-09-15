import { Active, ExpirationPeriod } from '../../../types';
import { Request } from '../Request';
interface GetCandlesMessage {
    name: 'get-candles';
    version: '2.0';
    body: {
        active_id: number;
        size: number | string;
        to: number;
        count: number;
    };
}
interface GetCandlesRequestArgs {
    active: Active;
    timePeriod: ExpirationPeriod;
    count: number;
    toDate: Date | number;
}
export declare class GetCandlesRequest extends Request<GetCandlesMessage, GetCandlesRequestArgs> {
    get name(): string;
    build({ active, timePeriod, count, toDate, }: GetCandlesRequestArgs): Promise<GetCandlesMessage>;
}
export {};
//# sourceMappingURL=GetCandles.d.ts.map