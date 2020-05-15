import { Scope, Store } from '@sardonyxwt/state-store';
export interface ModuleId {
    readonly key: string;
    readonly context?: string;
}
export interface Module<T = any> {
    readonly id: ModuleId;
    readonly body: T;
}
export interface ModuleStoreState {
    readonly modules: Module[];
}
export interface ModuleStore extends Scope<ModuleStoreState> {
    setModules(modules: Module[]): void;
    findModuleById<T>(id: ModuleId): Module<T>;
    isModuleExist(id: ModuleId): boolean;
}
export declare enum ModuleStoreActions {
    UpdateModules = "UPDATE_MODULES"
}
export declare const createModuleStore: (store: Store, initState: ModuleStoreState) => ModuleStore;
export declare function isModulesIdsEqual(moduleId1: ModuleId, moduleId2: ModuleId): boolean;
//# sourceMappingURL=module.store.d.ts.map