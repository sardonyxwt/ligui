import { ConstructorParameters, ConstructorReturnType } from './data';
export declare type Builder<T> = {
    set: <K extends keyof T>(key: K, value: T[K]) => Builder<T>;
    setFrom: (data: Partial<T>) => Builder<T>;
    build: () => T;
} & {
    [K in keyof T]: (value: T[K]) => Builder<T>;
};
export declare type BuilderFactory = <T extends new (...args: any[]) => any>(clazz: T) => (...constructorArgs: ConstructorParameters<typeof clazz>) => Builder<ConstructorReturnType<T>>;
export declare type Mapping = string | ((source: any) => any) | [string | ((source: any) => any), MappingResolver<any>];
export declare type MappingDecorator = (mapping?: Mapping, defaultValue?: any) => PropertyDecorator;
export declare type MappingDecoratorFactory = (sourceId?: string) => MappingDecorator;
export interface MappingResolver<T> {
    from: (source: any) => T;
    fromArray: (source: any) => T[];
}
export declare type MappingResolverFactory = <T extends new (...args: any[]) => any>(clazz: T, ...constructorArgs: ConstructorParameters<typeof clazz>) => (sourceId?: string) => MappingResolver<ConstructorReturnType<T>>;
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
