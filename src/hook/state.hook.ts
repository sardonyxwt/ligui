import * as React from 'react';
import { Scope } from '@sardonyxwt/state-store';
import { Core } from '@source/core';

/**
 * @type StateHook
 * @description React hook to manage state
 * @param scope {string | Scope} Scope or scope name.
 * @param actions {string[]} Array of actions for subscription.
 * @param mapper {(state: T) => MappedState} Mapper to change state.
 * @param optimizer {(oldState: MappedState, newState: MappedState) => boolean}
 * Get abilities to create update hit optimization.
 */
export type StateHook = <T = unknown, MappedState = T>(
    scope: string | Scope,
    actions?: string[],
    mapper?: (state: T) => MappedState,
    optimizer?: (oldState: MappedState, newState: MappedState) => boolean,
) => MappedState;

/**
 * @function createStateHook
 * @param coreGlobalRegisterName {string} Core instance global name.
 * @returns React hook to subscribe state change.
 */
export const createStateHook = (coreGlobalRegisterName: string): StateHook => <
    T = unknown,
    MappedState = T
>(
    scope: string | Scope,
    actions?: string[],
    mapper?: (state: T) => MappedState,
    optimizer?: (oldState: MappedState, newState: MappedState) => boolean,
): MappedState => {
    const core = global[coreGlobalRegisterName] as Core;

    const resolvedScope =
        typeof scope === 'string' ? core.store.getScope(scope) : scope;
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
