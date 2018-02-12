import { Scope } from '@sardonyxwt/state-store';
export interface RouteRule<T> {
    path: string;
    action: (...args: any[]) => Promise<T>;
}
export interface RouterProviderState {
    base?: string;
    currentLocation?: string;
    queryParams?: {
        [key: string]: number | string | boolean;
    };
}
export interface RouterProviderConfig {
    initState?: RouterProviderState;
}
export declare class RouterService {
    static readonly SCOPE_NAME: string;
    static readonly CHANGE_LOCATION: string;
    private scope;
    private static instance;
    private constructor();
    static readonly INSTANCE: RouterService;
    route<T>(rules: RouteRule<T>[], subscriber: (result: T) => void): void;
    go(path: string, title?: string, replace?: boolean): void;
    getScope(): Scope<RouterProviderState>;
    getQueryParams(): {
        [key: string]: string | number | boolean;
    };
    getCurrentLocation(): string;
    configure(config: RouterProviderConfig): void;
}
