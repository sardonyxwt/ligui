export declare type Builder<T> = {
    set: <K extends keyof T>(key: K, value: T[K]) => Builder<T>;
    setFrom: (data: Partial<T>) => Builder<T>;
    build: () => T;
} & {
    [K in keyof T]: (value: T[K]) => Builder<T>;
};
export declare type BuilderProps<T = {}> = Partial<{
    [K in keyof T]: ((entity: T) => T[K]) | T[K];
}>;
export declare type BuilderFactory = <T>(clazz: new (...args: any[]) => T, initProps?: BuilderProps<T>) => () => Builder<T>;
export interface Decorator {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
}
export declare type Mapping = string | ((source: any) => any) | [string | ((source: any) => any), MappingResolver<any>];
export declare type MappingDecorator = (mapping?: Mapping, defaultValue?: any) => Decorator;
export declare type MappingDecoratorFactory = (sourceId?: string) => MappingDecorator;
export interface MappingResolver<T> {
    from: (source: any) => T;
    fromArray: (source: any) => T[];
}
export declare type MappingResolverFactory = <T>(clazz: new (...args: any[]) => T, sourceId?: string) => MappingResolver<T>;
export declare const clone: <T>(source: T) => T;
export declare const cloneArray: <T>(sources: T[]) => T[];
export declare const cloneArrays: <T>(...sourceArrays: T[][]) => T[];
export declare const copyArray: <T>(sources: T[]) => T[];
export declare const copyArrays: <T>(...sourceArrays: T[][]) => T[];
export declare const resolveArray: <T>(source: T | T[]) => T[];
export declare const arrayFrom: <T>(...sources: (T | T[])[]) => T[];
export declare const resolveValue: (object: any, path: string) => any;
export declare const builderFactory: BuilderFactory;
export declare const MAPPING_METADATA_KEY = "metadata:mapping";
export declare const MAPPING_DEFAULT_SOURCE_ID = "default";
export declare const mappingDecoratorFactory: MappingDecoratorFactory;
export declare const mapping: MappingDecorator;
export declare const mappingResolverFactory: MappingResolverFactory;
export declare const MAPPING: {
    date: MappingResolver<Date>;
    split: (separator: string | RegExp, limit?: number) => MappingResolver<string>;
};
