import { ContainerId, ContainerKey } from '..';
export declare function useDependency<T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any): T;
export declare function useDependencies<T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any): T[];
