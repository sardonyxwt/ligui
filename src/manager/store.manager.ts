import { ROOT_SCOPE, createScope, getScope, getState } from '@sardonyxwt/state-store';

export class StoreManager {

  private static instance: StoreManager;
  public readonly ROOT_SCOPE = ROOT_SCOPE;

  private constructor() {
  }

  static get INSTANCE() {
    return this.instance || (this.instance = new StoreManager());
  }

  createScope = createScope;
  getScope = getScope;
  getState = getState;

}


