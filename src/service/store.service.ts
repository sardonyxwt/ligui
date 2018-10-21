import {
  createSyncScope, createAsyncScope, composeScope, getScope, getState, setStoreDevTool, ROOT_SCOPE,
  Scope, SyncScope, AsyncScope, ScopeMiddleware, StoreDevTool
} from '@sardonyxwt/state-store';

export interface StoreService {
  createSyncScope<T>(name?: string, initState?: T, middleware?: ScopeMiddleware<T, T>[]): SyncScope<T>;
  createAsyncScope<T>(name?: string, initState?: T, middleware?: ScopeMiddleware<T, Promise<T>>[]): AsyncScope<T>;
  composeScope(name: string, scopes: (Scope | string)[], middleware?: ScopeMiddleware<any, Promise<any>>[]): AsyncScope<{}>;
  getScope(scopeName: string): Scope;
  getState(): {};
  setStoreDevTool(devTool: StoreDevTool): void;
  ROOT_SCOPE: AsyncScope<{}>;
}

class StoreServiceImpl implements StoreService {

  ROOT_SCOPE = ROOT_SCOPE;

  createSyncScope<T>(name?: string, initState?: T, middleware?: ScopeMiddleware<T, T>[]) {
    return createSyncScope(name, initState, middleware);
  }

  createAsyncScope<T>(name?: string, initState?: T, middleware?: ScopeMiddleware<T, Promise<T>>[]) {
    return createAsyncScope(name, initState, middleware);
  }

  composeScope(name: string, scopes: (Scope | string)[], middleware?: ScopeMiddleware<any, Promise<any>>[]) {
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
