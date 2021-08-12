import { Request } from '../Request';
interface GetProfileRequestMessage {
    name: 'core.get-profile';
    version: '1.0';
    body: {};
}
export declare class GetProfileRequest extends Request<GetProfileRequestMessage> {
    get name(): string;
    build(): Promise<GetProfileRequestMessage>;
}
export {};
//# sourceMappingURL=GetProfile.d.ts.map