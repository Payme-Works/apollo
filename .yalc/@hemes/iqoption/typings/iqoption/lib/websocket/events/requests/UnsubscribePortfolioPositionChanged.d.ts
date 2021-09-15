import { InstrumentType } from '../../../types';
import { Request } from '../Request';
interface UnsubscribePortfolioPositionChangedMessage {
    name: 'portfolio.position-changed';
    version: '2.0';
    params: {
        routingFilters: {
            instrument_type: InstrumentType;
            user_balance_id: number;
        };
    };
}
interface UnsubscribePortfolioPositionChangedArgs {
    instrument_type: InstrumentType;
    user_balance_id: number;
}
export declare class UnsubscribePortfolioPositionChanged extends Request<UnsubscribePortfolioPositionChangedMessage, UnsubscribePortfolioPositionChangedArgs> {
    get name(): string;
    build({ instrument_type, user_balance_id, }: UnsubscribePortfolioPositionChangedArgs): Promise<UnsubscribePortfolioPositionChangedMessage>;
}
export {};
//# sourceMappingURL=UnsubscribePortfolioPositionChanged.d.ts.map