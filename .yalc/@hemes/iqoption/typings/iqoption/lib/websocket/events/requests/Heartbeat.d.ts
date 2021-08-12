import { Request } from '../Request';
interface HeartbeatRequestMessage {
    heartbeatTime: string;
    userTime: string;
}
interface HeartbeatRequestArgs {
    heartbeatTime: string;
}
export declare class HeartbeatRequest extends Request<HeartbeatRequestMessage, HeartbeatRequestArgs> {
    get name(): string;
    build({ heartbeatTime, }: HeartbeatRequestArgs): Promise<HeartbeatRequestMessage>;
}
export {};
//# sourceMappingURL=Heartbeat.d.ts.map