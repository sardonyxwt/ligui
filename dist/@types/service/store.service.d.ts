import { Scope, ScopeMiddleware, StoreDevTool } from '@sardonyxwt/state-store';
export interface StoreService {
    createScope<T>(name?: string, initState?: T, middleware?: ScopeMiddleware<T>[]): Scope<T>;
    composeScope(name: string, scopes: (Scope | string)[], middleware?: ScopeMiddleware[]): Scope;
    getScope(scopeName: string): Scope;
    getState(): {};
    setStoreDevTool(devTool: StoreDevTool): void;
    ROOT_SCOPE: Scope<{}>;
}
export declare const storeService: StoreService;
