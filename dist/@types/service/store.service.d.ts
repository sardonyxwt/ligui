import { Scope, SyncScope, AsyncScope, ScopeMiddleware, StoreDevTool } from '@sardonyxwt/state-store';
export interface StoreService {
    createSyncScope<T>(name?: string, initState?: T, middleware?: ScopeMiddleware<T, T>[]): SyncScope<T>;
    createAsyncScope<T>(name?: string, initState?: T, middleware?: ScopeMiddleware<T, Promise<T>>[]): AsyncScope<T>;
    composeScope(name: string, scopes: (Scope | string)[], middleware?: ScopeMiddleware<any, Promise<any>>[]): AsyncScope<{}>;
    getScope(scopeName: string): Scope;
    getState(): {};
    setStoreDevTool(devTool: StoreDevTool): void;
    ROOT_SCOPE: AsyncScope<{}>;
}
export declare const storeService: StoreService;
