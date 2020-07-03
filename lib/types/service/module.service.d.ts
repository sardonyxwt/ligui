import { Module, ModuleId, ModuleStore } from "../store/module.store";
export interface ModuleLoader {
    readonly context?: string;
    readonly loader: (key: string) => unknown | Promise<unknown>;
}
export interface ModulePromise {
    readonly id: ModuleId;
    readonly promise: Promise<Module>;
}
export interface ModuleService {
    setModuleLoader(loader: ModuleLoader): void;
    getModuleLoader(context?: string): ModuleLoader;
    loadModule<T>(id: ModuleId): Module<T> | Promise<Module<T>>;
}
export declare class ModuleServiceImpl implements ModuleService {
    protected _store: ModuleStore;
    protected _moduleLoaders: ModuleLoader[];
    private _modulePromises;
    constructor(_store: ModuleStore, _moduleLoaders?: ModuleLoader[]);
    setModuleLoader(loader: ModuleLoader): void;
    getModuleLoader(context?: string): ModuleLoader;
    loadModule<T>(id: ModuleId): Module<T> | Promise<Module<T>>;
}
