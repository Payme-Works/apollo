import { BaseEventSubscriber, WebSocketEvent } from '../../types';
import { WebSocketClient } from '../WebSocketClient';
export declare abstract class Subscriber<Message = any> implements BaseEventSubscriber<Message> {
    webSocket: WebSocketClient;
    constructor(webSocket: WebSocketClient);
    abstract get name(): string;
    abstract update(event: WebSocketEvent<Message>): void;
}
//# sourceMappingURL=Subscriber.d.ts.map