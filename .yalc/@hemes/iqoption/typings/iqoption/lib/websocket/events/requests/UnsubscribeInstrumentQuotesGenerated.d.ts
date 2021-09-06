import { Active, ExpirationPeriod, InstrumentType } from '../../../types';
import { Request } from '../Request';
interface UnsubscribeInstrumentQuotesGeneratedMessage {
    name: 'instrument-quotes-generated';
    version: '1.0';
    params: {
        routingFilters: {
            active: number;
            expiration_period: number;
            kind: InstrumentType;
        };
    };
}
interface UnsubscribeInstrumentQuotesGeneratedArgs {
    active: Active;
    expiration_period: ExpirationPeriod;
    kind: InstrumentType;
}
export declare class UnsubscribeInstrumentQuotesGeneratedRequest extends Request<UnsubscribeInstrumentQuotesGeneratedMessage, UnsubscribeInstrumentQuotesGeneratedArgs> {
    get name(): string;
    build({ active, expiration_period, kind, }: UnsubscribeInstrumentQuotesGeneratedArgs): Promise<UnsubscribeInstrumentQuotesGeneratedMessage>;
}
export {};
//# sourceMappingURL=UnsubscribeInstrumentQuotesGenerated.d.ts.map