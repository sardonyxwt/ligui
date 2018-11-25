import * as React from 'react';
import { uniqueId } from '@sardonyxwt/utils/generator';
import { storeService, Scope } from '..';

interface ScopeActionTree {
  [scopeName: string]: {
    [listenerId: string]: (actionName: string) => void
  }
}

const scopeActionTree: ScopeActionTree = {};

export function useScope<T = any>(scope: string | Scope<T>, actions: string[] = null): T {
  const listenerId = uniqueId('UseScopeHook');
  const currentScope: Scope<T> = typeof scope === 'string' ? storeService.getScope(scope) : scope;
  const [state, setState] = React.useState(currentScope.state);

  React.useEffect(() => {
    if (!(currentScope.name in scopeActionTree)) {
      const scopeSubscribers = scopeActionTree[currentScope.name] = {};
      currentScope.subscribe(e =>
        Object.getOwnPropertyNames(scopeSubscribers).forEach(key => scopeSubscribers[key](e.actionName)));
    }
    scopeActionTree[currentScope.name][listenerId] = (actionName) => {
      if (actions && !actions.find(it => it === actionName)) {
        return;
      }
      setState(currentScope.state);
    };
    return () => delete scopeActionTree[currentScope.name][listenerId];
  });

  return state;
}

