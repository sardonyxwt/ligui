import { interfaces } from 'inversify';
import { Context } from '../context';
export declare type ContainerKey = string | number | symbol;
export declare type ContainerId<T = any> = string | symbol | interfaces.Newable<T> | interfaces.Abstract<T>;
export declare type DependencyHookType = <T = any>(context: Context, id: ContainerId<T>, keyOrName?: ContainerKey, value?: any) => T;
export declare type DependenciesHookType = <T = any>(context: Context, id: ContainerId<T>, keyOrName?: ContainerKey, value?: any) => T[];
export declare function useDependency<T = any>(context: Context, id: ContainerId<T>, keyOrName?: ContainerKey, value?: any): T;
export declare function useDependencies<T = any>(context: Context, id: ContainerId<T>, keyOrName?: ContainerKey, value?: any): T[];
