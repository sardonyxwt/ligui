import { observable, action } from 'mobx';
import { saveToArray } from '@sardonyxwt/utils/object';

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

    findModuleById(id: ModuleId): Module;

    isModuleExist(id: ModuleId): boolean;
}

export class ModuleStoreImpl implements ModuleStore {

    @observable.shallow readonly modules: Module[] = [];

    constructor(modules: Module[] = []) {
        this.modules.push(...modules);
    }

    @action setModule(...modules: Module[]): void {
        modules.forEach(module => saveToArray(
            this.modules, module,
            existModule => isModulesIdsEqual(module.id, existModule.id)
        ));
    }

    findModuleById(id: ModuleId): Module {
        return this.modules.find(module => isModulesIdsEqual(module.id, id));
    }

    isModuleExist(id: ModuleId): boolean {
        return !!this.findModuleById(id);
    }

}

export function isModulesIdsEqual(moduleId1: ModuleId, moduleId2: ModuleId) {
    return moduleId1.key === moduleId2.key
        && moduleId1.context === moduleId2.context;
}
