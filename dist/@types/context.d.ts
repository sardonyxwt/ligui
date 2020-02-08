import { Store } from '@sardonyxwt/state-store';
import { Container } from 'inversify';
export interface Context {
    readonly store: Store;
    readonly container: Container;
}
export declare function createContext(name: string, container?: Container): Context;
//# sourceMappingURL=context.d.ts.map