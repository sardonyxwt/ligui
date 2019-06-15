import { Container, interfaces } from 'inversify';
export declare type ContainerKey = string | number | symbol;
export declare const createDependencyHook: (container: Container) => <T = any>(id: string | symbol | interfaces.Newable<T> | interfaces.Abstract<T>, keyOrName?: string | number | symbol, value?: any) => T;
export declare const createDependenciesHook: (container: Container) => <T = any>(id: string | symbol | interfaces.Newable<T> | interfaces.Abstract<T>, keyOrName?: string | number | symbol, value?: any) => T[];
