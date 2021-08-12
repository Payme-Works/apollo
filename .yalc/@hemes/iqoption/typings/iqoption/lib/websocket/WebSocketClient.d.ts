import { WebSocketEvent, WebSocketEventHistory, BaseWebSocketClient, WaitForOptions, EventRequestConstructor, EventResponseConstructor, CheckForUnion } from '../types';
export declare class WebSocketClient implements BaseWebSocketClient {
    private webSocket;
    private subscribers;
    history: WebSocketEventHistory[];
    constructor();
    subscribe(): void;
    send<Message, Args = undefined>(Request: EventRequestConstructor<Message, Args>, args?: CheckForUnion<Args, never, Args>): Promise<WebSocketEvent<Message>>;
    waitFor<Message>(Response: EventResponseConstructor<Message>, options?: WaitForOptions<Message>): Promise<WebSocketEventHistory<Message> | undefined>;
}
//# sourceMappingURL=WebSocketClient.d.ts.map