import { BaseEventRequest } from '../../types';
export declare abstract class Request<Message = any, Args = undefined> implements BaseEventRequest<Message, Args> {
    abstract get name(): string;
    abstract build(args: Args): Promise<Message>;
}
//# sourceMappingURL=Request.d.ts.map