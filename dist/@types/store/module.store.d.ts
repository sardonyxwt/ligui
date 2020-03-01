import { Repository } from '../service/repository.service';
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
export interface ModuleStore extends ModuleStoreState {
    setModule(...modules: Module[]): void;
    findModuleById<T>(id: ModuleId): Module<T>;
    isModuleExist(id: ModuleId): boolean;
}
export declare class ModuleStoreImpl implements ModuleStore, Repository<ModuleStoreState> {
    readonly modules: Module[];
    constructor(modules?: Module[]);
    setModule(...modules: Module[]): void;
    findModuleById<T>(id: ModuleId): Module<T>;
    isModuleExist(id: ModuleId): boolean;
    collect(): ModuleStoreState;
    restore(state: ModuleStoreState): void;
    reset(): void;
}
export declare function isModulesIdsEqual(moduleId1: ModuleId, moduleId2: ModuleId): boolean;
//# sourceMappingURL=module.store.d.ts.map