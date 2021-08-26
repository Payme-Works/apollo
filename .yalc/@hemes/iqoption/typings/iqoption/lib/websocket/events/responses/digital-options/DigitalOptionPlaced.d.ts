import { Response } from '../../Response';
export interface DigitalOptionPlaced {
    id: number;
    message?: 'active_suspended';
}
export declare class DigitalOptionPlacedResponse extends Response<DigitalOptionPlaced> {
    get name(): string;
}
//# sourceMappingURL=DigitalOptionPlaced.d.ts.map