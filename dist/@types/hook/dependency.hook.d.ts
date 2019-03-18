import { ContainerId, ContainerKey } from '..';
export declare type DependencyHookType = <T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any) => T;
export declare type DependenciesHookType = <T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any) => T[];
export declare function useDependency<T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any): T;
export declare function useDependencies<T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any): T[];
