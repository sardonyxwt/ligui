import { Scope, Store } from '@sardonyxwt/state-store';
export declare const createStateHook: (store: Store) => <T = unknown, MappedState = T>(scope: string | Scope, actions?: string[], mapper?: (state: T) => MappedState, optimizer?: (oldState: MappedState, newState: MappedState) => boolean) => MappedState;
