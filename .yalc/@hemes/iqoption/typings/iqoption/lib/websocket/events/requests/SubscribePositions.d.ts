import { Request } from '../Request';
interface SubscribePositionsMessage {
    name: 'subscribe-positions';
    version: '1.0';
    body: {
        frequency: 'frequent';
        ids: string[];
    };
}
interface SubscribePositionsArgs {
    positions_ids: string[];
}
export declare class SubscribePositions extends Request<SubscribePositionsMessage, SubscribePositionsArgs> {
    get name(): string;
    build({ positions_ids, }: SubscribePositionsArgs): Promise<SubscribePositionsMessage>;
}
export {};
//# sourceMappingURL=SubscribePositions.d.ts.map