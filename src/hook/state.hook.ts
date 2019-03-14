import * as React from 'react';
import { createUniqueIdGenerator } from '@sardonyxwt/utils/generator';
import { Scope } from '..';

interface ScopeActionTree {
  [scopeName: string]: {
    [listenerId: string]: (actionName: string) => void
  }
}

export type StateHookType = <T = any>(scope: Scope<T>, actions?: string[], retention?: number) => T;

const scopeActionTree: ScopeActionTree = {};
const stateHookListenerIdGenerator = createUniqueIdGenerator('StateHook');

export function StateHook<T = any>(scope: Scope<T>, actions: string[] = null, retention = 0): T {
  const [state, setState] = React.useState(scope.state);

  React.useEffect(() => {
    const listenerId = stateHookListenerIdGenerator();
    let timeoutId: number;
    if (!(scope.name in scopeActionTree)) {
      const scopeSubscribers = scopeActionTree[scope.name] = {};
      scope.subscribe(e =>
        Object.getOwnPropertyNames(scopeSubscribers).forEach(key => scopeSubscribers[key](e.actionName)));
    }
    scopeActionTree[scope.name][listenerId] = (actionName) => {
      if (actions && !actions.find(it => it === actionName)) {
        return;
      }
      if (retention && retention > 0) {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => setState(scope.state), retention);
        return;
      }
      setState(scope.state);
    };
    return () => delete scopeActionTree[scope.name][listenerId];
  });

  return state;
}
