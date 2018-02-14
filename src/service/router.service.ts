import route from 'riot-route'
import { createScope, Scope } from '../';

export interface RouteRule<T> { path: string; action: (...args: any[]) => Promise<T>; }
export interface RouterProviderState {
  base?: string;
  currentLocation?: string;
  queryParams?: { [key: string]: number | string | boolean }
}
export interface RouterProviderConfig { initState?: RouterProviderState; }
export interface RouterService {
  route<T>(rules: RouteRule<T>[], subscriber: (result: T) => void): void;
  go(path: string, title?: string, replace?: boolean): void;
  getScope(): Scope<RouterProviderState>;
  getQueryParams(): {
    [key: string]: string | number | boolean;
  };
  getCurrentLocation(): string;
  configure(config: RouterProviderConfig): void;
}

export const ROUTER_SCOPE_NAME = 'ROUTER_SCOPE';

class RouterServiceImpl implements RouterService {

  public readonly CHANGE_LOCATION = 'CHANGE_LOCATION';

  private scope: Scope<RouterProviderState>;

  route<T>(rules: RouteRule<T>[], subscriber: (result: T) => void) {
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

  configure(config: RouterProviderConfig) {
    if (this.scope) {
      throw new Error('RouterService must configure only once.');
    }
    const initState: RouterProviderState = config.initState || {};
    initState.base = initState.base || '#';
    initState.queryParams = initState.queryParams || {};
    initState.currentLocation = initState.currentLocation || '/';

    this.scope = createScope<RouterProviderState>(
      ROUTER_SCOPE_NAME,
      initState
    );
    this.scope.registerAction(
      this.CHANGE_LOCATION,
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
      alert(args.join('/'));
      this.scope.dispatch(this.CHANGE_LOCATION, {
        queryParams: route.query(),
        currentLocation: args.join('/')
      })
    });
    route.start();
  }

}

export const routerService: RouterService = new RouterServiceImpl();
