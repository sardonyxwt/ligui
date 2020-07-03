export declare const useData: <T>(dataResolver: () => T, dataLoader?: () => Promise<T>, dataSync?: (cb: (newData: T) => void) => (() => void) | void) => T;
