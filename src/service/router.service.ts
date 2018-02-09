import { createScope, Scope } from '@sardonyxwt/state-store';

export interface IRouteRule {
  path: string;
  component: JSX.Element | (() => Promise<JSX.Element>);
  security?: () => boolean;
  redirect?: () => string;
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

export class RouterService {

  public static readonly SCOPE_NAME = 'ROUTER_SCOPE';
  private scope: Scope<IRouterProviderState>;
  private isConfigured: boolean;
  private static instance: RouterService;

  private constructor() {
  }

  static get INSTANCE() {
    return this.instance || (this.instance = new RouterService());
  }

  route(rules: IRouteRule[], subscriber: (jsxEl: JSX.Element) => void) {
    return undefined;
  }

  configure(config: IRouterProviderConfig) {
    if (this.isConfigured) {
      throw new Error('RouterService must configure only once.');
    } else this.isConfigured = true;
    this.scope = createScope<IRouterProviderState>(
      RouterService.SCOPE_NAME,
      config.initState
    );
    this.scope.freeze();
  }

}
