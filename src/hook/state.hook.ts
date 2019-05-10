import * as React from 'react';
import { Scope } from '@sardonyxwt/state-store';

export function useState<T = any>(scope: Scope<T>, actions: string[] = null, retention = 0): T {
  const [state, setState] = React.useState(scope.state);

  React.useEffect(() => {
    let timeoutId: number;

    return scope.subscribe(evt => {
      if (retention && retention > 0) {
        clearTimeout(timeoutId);
        timeoutId = global.setTimeout(() => setState(evt.newState), retention) as any as number;
        return;
      }
      setState(evt.newState);
    }, actions);
  });

  return state;
}
