import {
  createScope, composeScope, getScope, getState, setStoreDevTool, ROOT_SCOPE,
  Scope, ScopeMiddleware, StoreDevTool
} from '@sardonyxwt/state-store';

export interface StoreService {
  createScope<T>(name?: string, initState?: T, middleware?: ScopeMiddleware<T>[]): Scope<T>;
  composeScope(name: string, scopes: (Scope | string)[], middleware?: ScopeMiddleware[]): Scope;
  getScope(scopeName: string): Scope;
  getState(): {};
  setStoreDevTool(devTool: StoreDevTool): void;
  ROOT_SCOPE: Scope<{}>;
}

class StoreServiceImpl implements StoreService {

  ROOT_SCOPE = ROOT_SCOPE;

  createScope<T>(name?: string, initState?: T, middleware?: ScopeMiddleware<T>[]) {
    return createScope(name, initState, middleware);
  }

  composeScope(name: string, scopes: (Scope | string)[], middleware?: ScopeMiddleware[]) {
    return composeScope(name, scopes, middleware);
  }

  getScope(scopeName: any) {
    return getScope(scopeName);
  }

  getState() {
    return getState();
  }

  setStoreDevTool(devTool: StoreDevTool) {
    setStoreDevTool(devTool)
  }

}

export const storeService: StoreService = new StoreServiceImpl();
