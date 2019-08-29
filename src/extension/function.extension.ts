// ToDo move to utils package
import { Parameters, ReturnType } from './data.extension';

export const resolveFunctionCall = <T extends Function>(func: T, ...flags: boolean[]): T =>
    !func || flags.findIndex(it => !it) >= 0 ? (() => null) as any : func;

// ToDo move to utils package
export const prepareFunctionCall = <T extends Function>(func: T, ...flags: boolean[]):
    ((...args: Parameters<typeof func>) => () => ReturnType<typeof func>) =>
    !func || flags.findIndex(it => !it) >= 0 ? (() => () => null) as any : (...args) => () => func(...args);

// ToDo move to utils package
export type DeferredCall = <T extends (...args) => void>(f: T, waitTime: number) => T;
export const deferred: DeferredCall = <T extends (...args) => void>(f: T, waitTime: number) => {
    let timeoutId = null;
    return ((...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => f(...args), waitTime);
    }) as T;
};

// ToDo move to utils package
export const charFromHexCode = (hexCode: string) => String.fromCharCode(parseInt(hexCode, 16));
