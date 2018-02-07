import { createScope, getScope, getState, Scope } from '@sardonyxwt/state-store';
export declare class StoreService {
    private static instance;
    readonly ROOT_SCOPE: Scope;
    private constructor();
    static readonly INSTANCE: StoreService;
    createScope: typeof createScope;
    getScope: typeof getScope;
    getState: typeof getState;
}
