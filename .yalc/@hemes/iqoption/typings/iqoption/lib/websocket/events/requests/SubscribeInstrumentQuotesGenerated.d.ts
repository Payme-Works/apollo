import { Active, ExpirationPeriod, InstrumentType } from '../../../types';
import { Request } from '../Request';
interface SubscribeInstrumentQuotesGeneratedRequestMessage {
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
interface SubscribeInstrumentQuotesGeneratedRequestArgs {
    active: Active;
    expiration_period: ExpirationPeriod;
    kind: InstrumentType;
}
export declare class SubscribeInstrumentQuotesGeneratedRequest extends Request<SubscribeInstrumentQuotesGeneratedRequestMessage, SubscribeInstrumentQuotesGeneratedRequestArgs> {
    get name(): string;
    build({ active, expiration_period, kind, }: SubscribeInstrumentQuotesGeneratedRequestArgs): Promise<SubscribeInstrumentQuotesGeneratedRequestMessage>;
}
export {};
//# sourceMappingURL=SubscribeInstrumentQuotesGenerated.d.ts.map