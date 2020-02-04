import { Module, ModuleId, ModuleStore } from '../store/module.store';
export interface ModuleLoader {
    readonly context?: string;
    readonly loader: (key: string) => Promise<any>;
}
export interface ModulePromise {
    readonly id: ModuleId;
    readonly resolver?: () => void;
    readonly promise: Promise<Module>;
}
export interface ModuleService {
    registerModuleLoader(loader: ModuleLoader): void;
    loadModule(id: ModuleId): Promise<Module>;
}
export declare class ModuleServiceImpl implements ModuleService {
    protected _store: ModuleStore;
    protected _moduleLoaders: ModuleLoader[];
    private _modulePromises;
    constructor(_store: ModuleStore, _moduleLoaders?: ModuleLoader[]);
    registerModuleLoader(loader: ModuleLoader): void;
    loadModule(id: ModuleId): Promise<Module>;
}
//# sourceMappingURL=module.service.d.ts.map