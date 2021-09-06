import { BaseEventResponse, WebSocketEvent } from '../../types';
export declare abstract class Response<Message = any> implements BaseEventResponse<Message> {
    abstract get name(): string;
    test(event: WebSocketEvent<Message>): Promise<boolean>;
}
//# sourceMappingURL=Response.d.ts.map