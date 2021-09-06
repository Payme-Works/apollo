import { UnderlyingType } from '../../../types';
import { Request } from '../Request';
interface GetUnderlyingListRequestMessage {
    name: 'get-underlying-list';
    version: '2.0';
    body: {
        type: UnderlyingType;
    };
}
interface GetUnderlyingListRequestArgs {
    type: UnderlyingType;
}
export declare class GetUnderlyingListRequest extends Request<GetUnderlyingListRequestMessage, GetUnderlyingListRequestArgs> {
    get name(): string;
    build({ type, }: GetUnderlyingListRequestArgs): Promise<GetUnderlyingListRequestMessage>;
}
export {};
//# sourceMappingURL=GetUnderlyingList.d.ts.map