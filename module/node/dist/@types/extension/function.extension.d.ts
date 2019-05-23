import { Parameters, ReturnType } from './data.extension';
export declare const resolveFunctionCall: <T extends Function>(func: T, ...flags: boolean[]) => T;
export declare const prepareFunctionCall: <T extends Function>(func: T, ...flags: boolean[]) => (...args: Parameters<T>) => () => ReturnType<T>;
export declare type DeferredCall = <T extends (...args: any[]) => void>(f: T, waitTime: number) => T;
export declare const deferred: DeferredCall;
export declare const charFromHexCode: (hexCode: string) => string;
