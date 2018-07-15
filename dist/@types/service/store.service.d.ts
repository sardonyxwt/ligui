import { Scope } from '@sardonyxwt/state-store';
export interface StoreService {
    createScope<T>(name?: string, initState?: T): Scope<T>;
    composeScope(name: string, scopes: (Scope | string)[]): Scope;
    getScope(scopeName: string): Scope;
    getState(): {};
    ROOT_SCOPE: Scope<{}>;
}
export declare const storeService: StoreService;
