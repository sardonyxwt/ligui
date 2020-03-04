import { Module, ModuleId, ModuleStore } from '../store/module.store';
export interface ModuleLoader {
    readonly context?: string;
    readonly loader: (key: string) => any | Promise<any>;
}
export interface ModulePromise {
    readonly id: ModuleId;
    readonly promise: Promise<Module>;
}
export interface ModuleService {
    registerModuleLoader(loader: ModuleLoader): void;
    loadModule(id: ModuleId): Module | Promise<Module>;
}
export declare class ModuleServiceImpl implements ModuleService {
    protected _store: ModuleStore;
    protected _moduleLoaders: ModuleLoader[];
    private _modulePromises;
    constructor(_store: ModuleStore, _moduleLoaders?: ModuleLoader[]);
    registerModuleLoader(loader: ModuleLoader): void;
    loadModule(id: ModuleId): Module | Promise<Module>;
}
//# sourceMappingURL=module.service.d.ts.map