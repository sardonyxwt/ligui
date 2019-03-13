import { ContainerId, ContainerKey } from '..';
export declare type DependencyHookType = <T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any) => T;
export declare type DependenciesHookType = <T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any) => T[];
export declare function DependencyHook<T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any): T;
export declare function DependenciesHook<T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any): T[];
