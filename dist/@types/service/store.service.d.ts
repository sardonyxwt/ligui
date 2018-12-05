import { Scope, ScopeConfig, StoreDevTool } from '@sardonyxwt/state-store';
export * from '@sardonyxwt/state-store';
export interface StoreService {
    createScope<T>(config?: ScopeConfig<T>): Scope<T>;
    composeScope<T = {}>(scopes: (Scope | string)[], config?: ScopeConfig<any>): Scope<T>;
    getScope(scopeName: string): Scope;
    getState(): {};
    setStoreDevTool(devTool: StoreDevTool): void;
}
export declare const storeService: StoreService;
