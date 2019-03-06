import { Scope } from '..';
export declare type StateHookType = <T = any>(scope: Scope<T>, actions?: string[], retention?: number) => T;
export declare const createStateHookInstance: () => StateHookType;
