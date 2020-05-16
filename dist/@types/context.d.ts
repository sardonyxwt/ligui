import * as Container from 'bottlejs';
import { Store } from '@sardonyxwt/state-store';
import { EventBus } from '@sardonyxwt/event-bus';
export interface Context {
    readonly store: Store;
    readonly bottle: Container;
    readonly eventBus: EventBus;
}
export declare function createContext(name: string, bottle?: Container): Context;
//# sourceMappingURL=context.d.ts.map