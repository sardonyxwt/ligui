export interface ModuleId {
    readonly key: string;
    readonly context?: string;
}
export interface Module<T = any> {
    readonly id: ModuleId;
    readonly body: T;
}
export interface ModuleStore {
    readonly modules: Module[];
    setModule(...modules: Module[]): void;
    findModuleById<T>(id: ModuleId): Module<T>;
    isModuleExist(id: ModuleId): boolean;
    reset(): void;
}
export declare class ModuleStoreImpl implements ModuleStore {
    readonly modules: Module[];
    constructor(modules?: Module[]);
    setModule(...modules: Module[]): void;
    findModuleById<T>(id: ModuleId): Module<T>;
    isModuleExist(id: ModuleId): boolean;
    reset(): void;
}
export declare function isModulesIdsEqual(moduleId1: ModuleId, moduleId2: ModuleId): boolean;
//# sourceMappingURL=module.store.d.ts.map