import * as React from 'react';
import { Store } from '@sardonyxwt/state-store';

export const createStateHook = (store: Store) =>
  <T = any>(scopeName: string, actions: string[] = null, retention = 0): T => {
    const [state, setState] = React.useState(() => store.getScope(scopeName).state);

    React.useEffect(() => {
      let timeoutId: number;

      return store.getScope(scopeName).subscribe(evt => {
        if (retention && retention > 0) {
          clearTimeout(timeoutId);
          timeoutId = global.setTimeout(() => setState(evt.newState), retention) as any as number;
          return;
        }
        setState(evt.newState);
      }, actions);
    });

    return state;
  };
