import { createScope, Scope } from '@sardonyxwt/state-store';
import { Provider } from '../provider';

export interface IRouteRule {
  path: string;
  component: JSX.Element | (() => Promise<JSX.Element>);
  security?: () => boolean;
  redirect?: () => string;
}

export interface IRouterService {
  route(rules: IRouteRule[], subscriber: (jsxEl: JSX.Element) => void);
}

export interface IRouterProviderState {
  currentLocation: string;
  params: { [key: string]: string };
}

export interface IRouterProviderConfig {
  loadingPreview?: JSX.Element;
  securityPreview?: JSX.Element;
  initState?: IRouterProviderState;
}

class RouterService implements IRouterService {

  static readonly SCOPE_NAME = 'ROUTER_SCOPE';

  readonly scope: Scope;

  constructor(private config: IRouterProviderConfig) {
    this.scope = createScope<IRouterProviderState>(
      RouterService.SCOPE_NAME,
      config.initState
    );
    this.scope.freeze();
  }

  route(rules: IRouteRule[], subscriber: (jsxEl: JSX.Element) => void) {
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

  protected createService(config: IRouterProviderConfig): IRouterService {
    return new RouterService(config);
  }

}
