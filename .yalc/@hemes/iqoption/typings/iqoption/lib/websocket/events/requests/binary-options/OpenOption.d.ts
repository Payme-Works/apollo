import { Active, ExpirationPeriod, OrderDirection } from '../../../../types';
import { Request } from '../../Request';
interface OpenOptionRequestMessage {
    name: 'binary-options.open-option';
    version: '1.0';
    body: {
        user_balance_id: number;
        active_id: number;
        option_type_id: number;
        direction: OrderDirection;
        expired: number;
        price: number;
    };
}
interface OpenOptionRequestArgs {
    user_balance_id: number;
    active: Active;
    direction: OrderDirection;
    expiration_period: ExpirationPeriod;
    price: number;
}
export declare type BinaryOptionTypeId = 1;
export declare type TurboOptionTypeId = 3;
export declare class OpenOptionRequest extends Request<OpenOptionRequestMessage, OpenOptionRequestArgs> {
    get name(): string;
    build({ user_balance_id, active, direction, expiration_period, price, }: OpenOptionRequestArgs): Promise<OpenOptionRequestMessage>;
}
export {};
//# sourceMappingURL=OpenOption.d.ts.map