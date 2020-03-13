import { Container } from 'inversify';
import { Store } from '@sardonyxwt/state-store';
import { EventBus } from '@sardonyxwt/event-bus';
export interface Context {
    readonly store: Store;
    readonly container: Container;
    readonly eventBus: EventBus;
}
export declare function createContext(name: string, container?: Container): Context;
//# sourceMappingURL=context.d.ts.map