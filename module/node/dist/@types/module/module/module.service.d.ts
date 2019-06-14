import { ModuleScope } from './module.scope';
export declare type ModuleLoader = (key: string, cb: (module: any) => void) => void;
export interface ModuleService {
    setModule<T>(key: string, module: T): void;
    getModule<T>(key: string): T;
    getLoadedModulesKeys(): string[];
    loadModule<T>(key: string): Promise<T>;
    isModuleLoaded(key: string): boolean;
}
export declare class ModuleServiceImpl implements ModuleService {
    private _loader;
    private _scope;
    private _modulePromises;
    constructor(_loader: ModuleLoader, _scope: ModuleScope);
    setModule<T>(key: string, module: T): void;
    getModule<T>(key: string): T;
    getLoadedModulesKeys(): string[];
    isModuleLoaded(key: string): boolean;
    loadModule<T>(key: string): Promise<T>;
}
