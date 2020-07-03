import * as React from 'react';
import { Scope, Store } from '@sardonyxwt/state-store';

export const createStateHook = (store: Store) => <T = unknown, MappedState = T>(
    scope: string | Scope,
    actions?: string[],
    mapper?: (state: T) => MappedState,
    optimizer?: (oldState: MappedState, newState: MappedState) => boolean,
): MappedState => {
    const resolvedScope =
        typeof scope === 'string' ? store.getScope(scope) : scope;
    const resolvedMapper =
        mapper ?? ((state: T) => (state as unknown) as MappedState);
    const stateRef = React.useRef<MappedState>(null);
    const [state, setState] = React.useState(() =>
        resolvedMapper(resolvedScope.state as T),
    );

    stateRef.current = state;

    React.useEffect(() => {
        return resolvedScope.subscribe((evt) => {
            const newState = resolvedMapper(evt.newState as T);
            if (optimizer && !optimizer(stateRef.current, newState)) {
                return;
            }
            stateRef.current = newState;
            setState(() => newState);
        }, actions);
    }, []);

    return state;
};
