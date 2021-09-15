import { BaseHemes, ClassPrototype, ProviderConstructor } from './types';
export declare class Hemes<T extends ClassPrototype> implements BaseHemes<T> {
    private provider;
    constructor(HemesProvider: T & ProviderConstructor<T>);
    getProvider<P = T['prototype']>(): P;
}
//# sourceMappingURL=Hemes.d.ts.map