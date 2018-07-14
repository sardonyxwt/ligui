import { createScope, Scope } from '@sardonyxwt/state-store';

export interface NavigationState {
  routeName: string;
  params: any;
}

export interface NavigationServiceState {
  stack: NavigationState[];
}

export interface NavigationServiceConfig {
  initState: NavigationServiceState;
}

export interface NavigationService {
  navigate(routeName: string, params, stepBack?: number): Promise<NavigationServiceState>;

  goBack(stepBack?: number): Promise<NavigationServiceState>;

  getScope(): Scope<NavigationServiceState>;

  getParams();

  getLocation(): string;

  getCurrentNavigationState(): NavigationState;

  configure(config: NavigationServiceConfig): void;
}

export const NAVIGATION_SCOPE_NAME = 'NAVIGATION_SCOPE';
export const NAVIGATION_SCOPE_ACTION_CHANGE = 'CHANGE_NAVIGATION';

class NavigationServiceImpl implements NavigationService {

  private scope: Scope<NavigationServiceState>;

  navigate(routeName: string, params, stepBackCount = 0) {
    return this.scope.dispatch(NAVIGATION_SCOPE_ACTION_CHANGE, {
      routeName, params, stepBackCount
    });
  }

  goBack(stepBackCount = 1) {
    return this.scope.dispatch(NAVIGATION_SCOPE_ACTION_CHANGE, {
      stepBackCount
    });
  }

  getScope(): Scope<NavigationServiceState> {
    return this.scope;
  }

  getParams() {
    let state = this.getCurrentNavigationState();
    return state ? state.params : null;
  }

  getLocation(): string {
    let state = this.getCurrentNavigationState();
    return state ? state.routeName : null;
  }

  getCurrentNavigationState(): NavigationState {
    let stack = this.scope.getState().stack;
    return stack.length > 0 ? stack[stack.length - 1] : null;
  }

  configure(config: NavigationServiceConfig): void {
    if (this.scope) {
      throw new Error('NavigationService must configure only once.');
    }
    this.scope = createScope(NAVIGATION_SCOPE_NAME, config.initState);
    this.scope.registerAction(
      NAVIGATION_SCOPE_ACTION_CHANGE,
      (scope, {routeName, params, stepBackCount}, resolve) => {
        if (stepBackCount < 0) {
          throw new Error('Step back count must plural.');
        }
        if (stepBackCount > 0 && scope.stack.length - stepBackCount - 1 < 1) {
          throw new Error('Step back count is bigger than history');
        }
        let newState = routeName ? {routeName, params} : scope.stack[scope.stack.length - stepBackCount - 1];
        let newStack = scope.stack.slice(0, scope.stack.length - stepBackCount - (routeName ? 0 : 1));
        newStack.push(newState);
        resolve({
          stack: newStack
        });
      });
    this.scope.lock();
  }

}

export const navigationService: NavigationService = new NavigationServiceImpl();

