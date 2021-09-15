import { Request } from '../Request';
interface SubscribePositionsStateMessage {
    name: 'positions-state';
}
export declare class SubscribePositionsState extends Request<SubscribePositionsStateMessage> {
    get name(): string;
    build(): Promise<SubscribePositionsStateMessage>;
}
export {};
//# sourceMappingURL=SubscribePositionsState.d.ts.map