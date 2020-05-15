import { Store } from '@sardonyxwt/state-store';
export declare const createStateHook: (store: Store) => <T = any, MappedState = T>(scopeName: string, actions?: string[], mapper?: (state: T) => MappedState, optimizer?: (oldState: MappedState, newState: MappedState) => boolean) => MappedState;
//# sourceMappingURL=state.hook.d.ts.map