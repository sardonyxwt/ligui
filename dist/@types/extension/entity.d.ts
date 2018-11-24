export declare type Builder<T, D = T> = {
    set: <K extends keyof D>(key: K, value: D[K]) => Builder<T, D>;
    setFrom: (data: Partial<D>) => Builder<T, D>;
    build: () => T;
} & {
    [K in keyof D]: (value: D[K]) => Builder<T, D>;
};
export interface EntityHelper<T, D = T> {
    builder?: (initProps?: Partial<D>) => Builder<T, D>;
    clone?: (source: T) => T;
    cloneArray?: (sources: T[]) => T[];
    cloneArrays?: (...sources: (T[])[]) => T[];
    copyArray?: (sources: T[]) => T[];
    copyArrays?: (...sources: (T[])[]) => T[];
    resolveArray?: (source: T | T[]) => T[];
}
export declare const entity: <T extends {}>(props?: {
    defaultProps?: Partial<T>;
}) => <C extends new (...args: any[]) => any>(constructor: C) => C & {
    $: EntityHelper<C, T>;
};
