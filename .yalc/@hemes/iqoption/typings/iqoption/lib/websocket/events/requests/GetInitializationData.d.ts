import { Request } from '../Request';
interface GetInitializationDataRequestMessage {
    name: 'get-initialization-data';
    version: '3.0';
}
export declare class GetInitializationDataRequest extends Request<GetInitializationDataRequestMessage> {
    get name(): string;
    build(): Promise<GetInitializationDataRequestMessage>;
}
export {};
//# sourceMappingURL=GetInitializationData.d.ts.map