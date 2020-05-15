import * as React from 'react';
import { Store } from '@sardonyxwt/state-store';

export const createStateHook = (
    store: Store
) => <T = any, MappedState = T>(
    scopeName: string,
    actions: string[] = null,
    mapper?: (state: T) => MappedState,
    optimizer?: (oldState: MappedState, newState: MappedState) => boolean
): MappedState => {
    const resolvedMapper = mapper ?? ((state: T) => state as unknown as MappedState);
    const stateRef = React.useRef<MappedState>(null);
    const [state, setState] = React.useState(
        () => resolvedMapper(store.getScope(scopeName).state)
    );

    stateRef.current = state;

    React.useEffect(() => {
        return store.getScope(scopeName).subscribe(evt => {
            const newState = resolvedMapper(evt.newState);
            if (optimizer && !optimizer(stateRef.current, newState)) {
                return;
            }
            stateRef.current = newState;
            setState(() => newState);
        }, actions);
    }, []);

    return state;
};
