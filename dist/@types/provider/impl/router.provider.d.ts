import { Provider } from '../provider';
export interface IRouteRule {
    path: string;
    component: JSX.Element | (() => Promise<JSX.Element>);
    security?: () => boolean;
    redirect?: () => string;
}
export interface IRouterService {
    route(rules: IRouteRule[], subscriber: (jsxEl: JSX.Element) => void): any;
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
export declare class RouterProvider extends Provider<IRouterService, IRouterProviderConfig> {
    private static instance;
    private constructor();
    static readonly INSTANCE: RouterProvider;
    protected createService(config: IRouterProviderConfig): IRouterService;
}
