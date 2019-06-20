import { ModuleScope } from '../scope/module.scope';
export interface ModuleLoader {
    key: string;
    loader: () => Promise<any>;
}
export interface ModulePromise {
    key: string;
    promise: Promise<any>;
}
export interface ModuleService {
    setModuleLoader<T>(loader: ModuleLoader): any;
    setModule<T>(key: string, module: T): void;
    getModule<T>(key: string): T;
    getLoadedModulesKeys(): string[];
    loadModule<T>(key: string): Promise<T>;
    isModuleLoaded(key: string): boolean;
}
export declare class ModuleServiceImpl implements ModuleService {
    protected _scope: ModuleScope;
    private _moduleLoaders;
    private _modulePromises;
    constructor(_scope: ModuleScope, _moduleLoaders?: ModuleLoader[]);
    setModuleLoader<T>(loader: ModuleLoader): void;
    setModule<T>(key: string, module: T): void;
    getModule<T>(key: string): T;
    getLoadedModulesKeys(): string[];
    isModuleLoaded(key: string): boolean;
    loadModule<T>(key: string): Promise<T>;
}
