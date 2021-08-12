import { InstrumentType } from '../../../types';
import { Request } from '../Request';
interface GetTopAssetsRequestMessage {
    name: 'get-top-assets';
    version: '1.2';
    body: {
        instrument_type: InstrumentType;
    };
}
interface GetTopAssetsRequestMessageRequestArgs {
    instrument_type: InstrumentType;
}
export declare class GetTopAssetsRequest extends Request<GetTopAssetsRequestMessage, GetTopAssetsRequestMessageRequestArgs> {
    get name(): string;
    build({ instrument_type, }: GetTopAssetsRequestMessageRequestArgs): Promise<GetTopAssetsRequestMessage>;
}
export {};
//# sourceMappingURL=GetTopAssets.d.ts.map