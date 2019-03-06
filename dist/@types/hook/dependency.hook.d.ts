import { ContainerId, ContainerKey, ContainerService } from '..';
export declare type DependencyHookType = <T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any) => T;
export declare type DependenciesHookType = <T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any) => T[];
export declare const createDependencyHookInstance: (containerService: ContainerService) => DependencyHookType;
export declare const createDependenciesHookInstance: (containerService: ContainerService) => DependenciesHookType;
