import { InstrumentType } from '../../../types';
import { Request } from '../Request';
interface SubscribePortfolioPositionChangedMessage {
    name: 'portfolio.position-changed';
    version: '2.0';
    params: {
        routingFilters: {
            instrument_type: InstrumentType;
            user_balance_id: number;
        };
    };
}
interface SubscribePortfolioPositionChangedArgs {
    instrument_type: InstrumentType;
    user_balance_id: number;
}
export declare class SubscribePortfolioPositionChanged extends Request<SubscribePortfolioPositionChangedMessage, SubscribePortfolioPositionChangedArgs> {
    get name(): string;
    build({ instrument_type, user_balance_id, }: SubscribePortfolioPositionChangedArgs): Promise<SubscribePortfolioPositionChangedMessage>;
}
export {};
//# sourceMappingURL=SubscribePortfolioPositionChanged.d.ts.map