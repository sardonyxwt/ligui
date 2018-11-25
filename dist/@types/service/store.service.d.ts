import { AsyncScope, Scope, ScopeConfig, StoreDevTool, SyncScope } from '@sardonyxwt/state-store';
export * from '@sardonyxwt/state-store';
export interface StoreService {
    createSyncScope<T>(config?: ScopeConfig<T, T>): SyncScope<T>;
    createAsyncScope<T>(config?: ScopeConfig<T, Promise<T>>): AsyncScope<T>;
    composeScope(scopes: (Scope | string)[], config?: ScopeConfig<any, Promise<{}>>): AsyncScope<{}>;
    getScope(scopeName: string): Scope;
    getState(): {};
    setStoreDevTool(devTool: StoreDevTool): void;
    ROOT_SCOPE: AsyncScope<{}>;
}
export declare const storeService: StoreService;
