import { Request } from '../Request';
interface GetBalancesRequestMessage {
    name: 'get-balances';
    version: '1.0';
}
export declare class GetBalancesRequest extends Request<GetBalancesRequestMessage> {
    get name(): string;
    build(): Promise<GetBalancesRequestMessage>;
}
export {};
//# sourceMappingURL=GetBalances.d.ts.map