import * as React from 'react';
import { createUniqueIdGenerator } from '@sardonyxwt/utils/generator';
import { storeService, Scope } from '..';

interface ScopeActionTree {
  [scopeName: string]: {
    [listenerId: string]: (actionName: string) => void
  }
}

export type StateHookType = <T = any>(scope: string | Scope<T>, actions?: string[], retention?: number) => T;

const scopeActionTree: ScopeActionTree = {};
const stateHookListenerIdGenerator = createUniqueIdGenerator('StateHook');

export function StateHook<T = any>(scope: string | Scope<T>, actions: string[] = null, retention = 0): T {
  const resolvedScope = typeof scope === 'string' ? storeService.getScope(scope) : scope;
  const [state, setState] = React.useState(resolvedScope.state);

  React.useEffect(() => {
    const listenerId = stateHookListenerIdGenerator();
    let timeoutId: number;
    if (!(resolvedScope.name in scopeActionTree)) {
      const scopeSubscribers = scopeActionTree[resolvedScope.name] = {};
      resolvedScope.subscribe(e =>
        Object.getOwnPropertyNames(scopeSubscribers).forEach(key => scopeSubscribers[key](e.actionName)));
    }
    scopeActionTree[resolvedScope.name][listenerId] = (actionName) => {
      if (actions && !actions.find(it => it === actionName)) {
        return;
      }
      if (retention && retention > 0) {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => setState(resolvedScope.state), retention);
        return;
      }
      setState(resolvedScope.state);
    };
    return () => delete scopeActionTree[resolvedScope.name][listenerId];
  });

  return state;
}
