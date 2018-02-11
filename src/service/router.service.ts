import route from 'riot-route'
import { createScope, Scope } from '@sardonyxwt/state-store';

export interface IRouteRule<T> {
  path: string;
  action: (...args: any[]) => Promise<T>;
}

export interface IRouterProviderState {
  base?: string;
  currentLocation?: string;
  queryParams?: { [key: string]: number | string | boolean }
}

export interface IRouterProviderConfig {
  initState?: IRouterProviderState;
}

export class RouterService {

  public static readonly SCOPE_NAME = 'ROUTER_SCOPE';
  public static readonly CHANGE_LOCATION = 'CHANGE_LOCATION';

  private scope: Scope<IRouterProviderState>;
  private isConfigured: boolean;
  private static instance: RouterService;

  private constructor() {
  }

  static get INSTANCE() {
    return this.instance || (this.instance = new RouterService());
  }

  route<T>(rules: IRouteRule<T>[], subscriber: (result: T) => void) {
    const routerContext = route.create();
    routerContext.base(this.scope.getState().base);
    rules.forEach(rule => {
      routerContext.route(rule.path, (...args: any[]) => {
        rule.action(args).then(
          result => subscriber(result)
        );
      })
    });
  }

  go(path: string, title?: string, replace?: boolean) {
    route(path, title, replace);
  }

  getScope() {
    return this.scope;
  }

  getQueryParams() {
    return this.scope.getState().queryParams;
  }

  getCurrentLocation() {
    return this.scope.getState().currentLocation
  }

  configure(config: IRouterProviderConfig) {
    if (this.isConfigured) {
      throw new Error('RouterService must configure only once.');
    } else this.isConfigured = true;
    const initState: IRouterProviderState = config.initState || {};
    initState.base = initState.base || '#';
    initState.queryParams = initState.queryParams || {};
    initState.currentLocation = initState.currentLocation || '/';

    this.scope = createScope<IRouterProviderState>(
      RouterService.SCOPE_NAME,
      initState
    );
    this.scope.registerAction(
      RouterService.CHANGE_LOCATION,
      (scope, props, resolve) => {
        resolve({
          base: scope.base,
          queryParams: props.queryParams,
          currentLocation: props.currentLocation,
        });
      }
    );
    this.scope.freeze();
    route((...args: any[]) => {
      alert([...args].join('/'));
      this.scope.dispatch(RouterService.CHANGE_LOCATION, {
        queryParams: route.query(),
        currentLocation: [...args].join('/')
      })
    });
    route.start();
  }

}
