import { Scope } from '@sardonyxwt/state-store';
export interface IRouteRule<T> {
    path: string;
    action: (...args: any[]) => Promise<T>;
}
export interface IRouterProviderState {
    base?: string;
    currentLocation?: string;
    queryParams?: {
        [key: string]: number | string | boolean;
    };
}
export interface IRouterProviderConfig {
    initState?: IRouterProviderState;
}
export declare class RouterService {
    static readonly SCOPE_NAME: string;
    static readonly CHANGE_LOCATION: string;
    private scope;
    private isConfigured;
    private static instance;
    private constructor();
    static readonly INSTANCE: RouterService;
    route<T>(rules: IRouteRule<T>[], subscriber: (result: T) => void): void;
    go(path: string, title?: string, replace?: boolean): void;
    getScope(): Scope<IRouterProviderState>;
    getQueryParams(): {
        [key: string]: string | number | boolean;
    };
    getCurrentLocation(): string;
    configure(config: IRouterProviderConfig): void;
}
