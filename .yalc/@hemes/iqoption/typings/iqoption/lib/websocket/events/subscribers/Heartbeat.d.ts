import { WebSocketEvent } from '../../../types';
import { Subscriber } from '../Subscriber';
export declare class HeartbeatSubscriber extends Subscriber<number> {
    get name(): string;
    update(event: WebSocketEvent<number>): void;
}
//# sourceMappingURL=Heartbeat.d.ts.map