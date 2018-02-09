export interface IRouteRule {
    path: string;
    component: JSX.Element | (() => Promise<JSX.Element>);
    security?: () => boolean;
    redirect?: () => string;
}
export interface IRouterProviderState {
    currentLocation: string;
    params: {
        [key: string]: string;
    };
}
export interface IRouterProviderConfig {
    loadingPreview?: JSX.Element;
    securityPreview?: JSX.Element;
    initState?: IRouterProviderState;
}
export declare class RouterService {
    static readonly SCOPE_NAME: string;
    private scope;
    private isConfigured;
    private static instance;
    private constructor();
    static readonly INSTANCE: RouterService;
    route(rules: IRouteRule[], subscriber: (jsxEl: JSX.Element) => void): any;
    configure(config: IRouterProviderConfig): void;
}
