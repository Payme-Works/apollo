import { Request } from '../Request';
export declare class SsidRequest extends Request<string, string> {
    get name(): string;
    build(ssid: string): Promise<string>;
}
//# sourceMappingURL=SSID.d.ts.map