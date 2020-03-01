import { observable, action, toJS } from 'mobx';
import { saveToArray } from '@sardonyxwt/utils/object';
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

export interface ModuleStore extends ModuleStoreState, Repository<ModuleStoreState> {
    setModule(...modules: Module[]): void;

    findModuleById<T>(id: ModuleId): Module<T>;

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

    findModuleById<T>(id: ModuleId): Module<T> {
        return this.modules.find(module => isModulesIdsEqual(module.id, id));
    }

    isModuleExist(id: ModuleId): boolean {
        return !!this.findModuleById(id);
    }

    collect(): ModuleStoreState {
        return {
            modules: toJS(this.modules)
        };
    }

    restore(state: ModuleStoreState): void {
        this.modules.splice(0, this.modules.length);
        this.modules.push(...state.modules);
    }

    reset(): void {
        this.modules.splice(0, this.modules.length);
    }

}

export function isModulesIdsEqual(moduleId1: ModuleId, moduleId2: ModuleId) {
    return moduleId1.key === moduleId2.key
        && moduleId1.context === moduleId2.context;
}
