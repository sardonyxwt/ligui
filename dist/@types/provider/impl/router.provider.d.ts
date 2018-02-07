import { Observable } from 'rxjs/Observable';
import { Provider } from '../provider';
export interface IRouterService {
    route(config: {
        path: string;
        component: JSX.Element | (() => Promise<JSX.Element>);
        security?: () => boolean;
        redirect?: () => string;
    }): Observable<JSX.Element | null>;
}
export interface IRouterProviderConfig {
    loadingPreview?: JSX.Element;
    securityPreview?: JSX.Element;
}
export declare class RouterProvider extends Provider<IRouterService, IRouterProviderConfig> {
    private static instance;
    private constructor();
    static readonly INSTANCE: RouterProvider;
    createService(config: IRouterProviderConfig): IRouterService;
}
