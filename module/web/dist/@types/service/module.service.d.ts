export declare type ModuleLoader = (key: string) => any | Promise<any>;
export interface ModuleService {
    setModule<T>(key: string, module: T): void;
    getModule<T>(key: string): T;
    getLoadedModulesKeys(): string[];
    loadModule<T>(key: string): Promise<T>;
    isModuleLoaded(key: string): boolean;
}
export declare class ModuleServiceImpl implements ModuleService {
    private _loader;
    private _modules;
    private _modulePromises;
    constructor(_loader: ModuleLoader);
    setModule<T>(key: string, module: T): void;
    getModule<T>(key: string): T;
    getLoadedModulesKeys(): string[];
    isModuleLoaded(key: string): boolean;
    loadModule<T>(key: string): Promise<T>;
}
