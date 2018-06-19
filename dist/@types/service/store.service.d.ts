import { Scope } from '@sardonyxwt/state-store';
export interface StoreService {
    createScope<T>(name?: string, initState?: T): Scope<T>;
    getScope(scopeName: any): Scope<any>;
    getState(): {};
    ROOT_SCOPE: Scope<{}>;
}
export declare const storeService: StoreService;
