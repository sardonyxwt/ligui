import { createScope, composeScope, getScope, getState, ROOT_SCOPE, Scope } from '@sardonyxwt/state-store';

export interface StoreService {
  createScope<T>(name?: string, initState?: T): Scope<T>;
  composeScope(name: string, scopes: (Scope | string)[]): Scope;
  getScope(scopeName: string): Scope;
  getState(): {};
  ROOT_SCOPE: Scope<{}>;
}

class StoreServiceImpl implements StoreService {

  ROOT_SCOPE = ROOT_SCOPE;

  createScope<T>(name?: string, initState?: T) {
    return createScope(name, initState);
  }

  composeScope(name: string, scopes: (Scope | string)[]) {
    return composeScope(name, scopes);
  }

  getScope(scopeName: any) {
    return getScope(scopeName);
  }

  getState() {
    return getState();
  }

}

export const storeService: StoreService = new StoreServiceImpl();
