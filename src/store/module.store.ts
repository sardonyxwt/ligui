import { Scope, Store } from '@sardonyxwt/state-store';
import { saveToArray, copyArray } from '@sardonyxwt/utils/object';
import { LIGUI_TYPES } from '../types';

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

export enum ModuleStoreActions {
    UpdateModules = 'UPDATE_MODULES',
}

export const createModuleStore = (store: Store, initState: ModuleStoreState) => {
    const moduleStore = store.createScope({
        name: LIGUI_TYPES.MODULE_STORE,
        initState: {
            modules: initState.modules || []
        },
        isSubscribedMacroAutoCreateEnabled: true,
    }, true) as ModuleStore;

    moduleStore.setModules = moduleStore.registerAction(
        ModuleStoreActions.UpdateModules,
        (state, modules: Module[]) => {
            const updatedModules = copyArray(state.modules);
            modules.forEach(module => saveToArray(
                updatedModules, module,
                existModule => isModulesIdsEqual(module.id, existModule.id)
            ));
            return {
                modules: updatedModules
            }
        }
    );

    moduleStore.findModuleById = (id: ModuleId) => {
        return moduleStore.state.modules.find(module => isModulesIdsEqual(module.id, id));
    };

    moduleStore.isModuleExist = (id: ModuleId) => {
        return !!moduleStore.findModuleById(id);
    };

    return moduleStore;
}

export function isModulesIdsEqual(moduleId1: ModuleId, moduleId2: ModuleId) {
    return moduleId1.key === moduleId2.key
        && moduleId1.context === moduleId2.context;
}
