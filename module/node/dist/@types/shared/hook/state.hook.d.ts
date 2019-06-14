import { Store } from '@sardonyxwt/state-store';
export declare const createStateHook: (store: Store) => <T = any>(scopeName: string, actions?: string[], retention?: number) => T;
