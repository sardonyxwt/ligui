import { Scope } from '..';
export declare type StateHookType = <T = any>(scope: string | Scope<T>, actions?: string[], retention?: number) => T;
export declare function StateHook<T = any>(scope: string | Scope<T>, actions?: string[], retention?: number): T;
