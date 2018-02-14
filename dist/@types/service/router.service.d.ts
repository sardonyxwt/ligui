import { Scope } from '../';
export interface QueryParams {
    [key: string]: string | number | boolean;
}
export interface RouteRule<T> {
    path: string;
    action: (...args: any[]) => Promise<T>;
}
export interface RouterProviderState {
    base?: string;
    currentLocation?: string;
    queryParams?: QueryParams;
}
export interface RouterProviderConfig {
    initState?: RouterProviderState;
}
export interface RouterService {
    route<T>(rules: RouteRule<T>[], subscriber: (result: T) => void): void;
    go(path: string, title?: string, replace?: boolean): void;
    getScope(): Scope<RouterProviderState>;
    getQueryParams(): QueryParams;
    getCurrentLocation(): string;
    configure(config: RouterProviderConfig): void;
}
export declare const ROUTER_SCOPE_NAME = "ROUTER_SCOPE";
export declare const ROUTER_SCOPE_ACTION_CHANGE = "CHANGE_LOCATION";
export declare const routerService: RouterService;
