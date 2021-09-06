import { Active, DigitalOptionExpirationPeriod, PositionDirection } from '../../../../types';
import { Request } from '../../Request';
interface PlaceDigitalOptionRequestMessage {
    name: 'digital-options.place-digital-option';
    version: '1.0';
    body: {
        user_balance_id: number;
        instrument_id: string;
        amount: string;
    };
}
interface PlaceDigitalOptionRequestArgs {
    user_balance_id: number;
    active: Active;
    direction: PositionDirection;
    expiration_period: DigitalOptionExpirationPeriod;
    price: number;
}
export declare class PlaceDigitalOptionRequest extends Request<PlaceDigitalOptionRequestMessage, PlaceDigitalOptionRequestArgs> {
    get name(): string;
    build({ user_balance_id, active, direction, expiration_period, price, }: PlaceDigitalOptionRequestArgs): Promise<PlaceDigitalOptionRequestMessage>;
}
export {};
//# sourceMappingURL=PlaceDigitalOption.d.ts.map