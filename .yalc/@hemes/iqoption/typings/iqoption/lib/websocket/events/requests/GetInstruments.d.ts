import { InstrumentType } from '../../../types';
import { Request } from '../Request';
interface GetInstrumentsRequestMessage {
    name: 'get-instruments';
    version: '4.0';
    body: {
        type: InstrumentType;
    };
}
interface GetInstrumentsRequestArgs {
    type: InstrumentType;
}
export declare class GetInstrumentsRequest extends Request<GetInstrumentsRequestMessage, GetInstrumentsRequestArgs> {
    get name(): string;
    build({ type, }: GetInstrumentsRequestArgs): Promise<GetInstrumentsRequestMessage>;
}
export {};
//# sourceMappingURL=GetInstruments.d.ts.map