import {createScope, getScope, getState, ROOT_SCOPE, Scope} from "@sardonyxwt/state-store";

export interface StoreService {
  createScope<T>(name?: string, initState?: T): Scope<T>;
  getScope(scopeName: any): Scope<any>;
  getState(): {};
  ROOT_SCOPE: Scope<{}>;
}

class StoreServiceImpl implements StoreService {
  ROOT_SCOPE = ROOT_SCOPE;

  createScope<T>(name?: string, initState?: T): Scope<T> {
    return createScope(name, initState);
  }

  getScope(scopeName: any): Scope<any> {
    return getScope(scopeName);
  }

  getState(): {} {
    return getState();
  }

}

export const storeService: StoreService = new StoreServiceImpl();
