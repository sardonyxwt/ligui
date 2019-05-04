import { Scope } from '@sardonyxwt/state-store';
export declare type StateHookType = <T = any>(scope: string | Scope<T>, actions?: string[], retention?: number) => T;
export declare function useState<T = any>(scope: Scope<T>, actions?: string[], retention?: number): T;
