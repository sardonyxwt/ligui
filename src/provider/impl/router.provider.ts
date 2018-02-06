import { Observable } from 'rxjs/Observable';

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

class RouterService implements IRouterService {

  route(config: {
    path: string;
    component: JSX.Element | (() => Promise<JSX.Element>);
    security?: () => boolean;
    redirect?: () => string;
  }): Observable<JSX.Element | null> {
    return undefined;
  }

}

export class RouterProvider extends Provider<IRouterService, IRouterProviderConfig> {

  private static instance: RouterProvider;

  private constructor() {
    super();
  }

  static get INSTANCE() {
    return this.instance || (this.instance = new RouterProvider());
  }

  createService(config: IRouterProviderConfig): IRouterService {
    return new RouterService();
  }

}
