import { Container, interfaces } from 'inversify';
export declare type ContainerKey = string | number | symbol;
export declare const createDependencyHook: (container: Container) => <T = any>(id: interfaces.ServiceIdentifier<T>, keyOrName?: ContainerKey, value?: any) => T;
export declare const createDependenciesHook: (container: Container) => <T = any>(id: interfaces.ServiceIdentifier<T>, keyOrName?: ContainerKey, value?: any) => T[];
//# sourceMappingURL=dependency.hook.d.ts.map