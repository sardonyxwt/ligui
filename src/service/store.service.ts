import { ROOT_SCOPE, createScope, getScope, getState, Scope } from '@sardonyxwt/state-store';

export class StoreService {

  private static instance: StoreService;
  public readonly ROOT_SCOPE: Scope = ROOT_SCOPE;

  private constructor() {
  }

  static get INSTANCE() {
    return this.instance || (this.instance = new StoreService());
  }

  createScope = createScope;
  getScope = getScope;
  getState = getState;

}


