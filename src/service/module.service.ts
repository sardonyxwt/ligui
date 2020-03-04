import { saveToArray, deleteFromArray } from '@sardonyxwt/utils/object';
import { isModulesIdsEqual, Module, ModuleId, ModuleStore } from '../store/module.store';

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

export class ModuleServiceImpl implements ModuleService {

    private _modulePromises: ModulePromise[] = [];

    constructor(protected _store: ModuleStore,
                protected _moduleLoaders: ModuleLoader[] = []) {
    }

    registerModuleLoader(loader: ModuleLoader) {
        deleteFromArray(this._modulePromises, modulePromise => modulePromise.id.context === loader.context);
        saveToArray(this._moduleLoaders, loader, moduleLoader => moduleLoader.context === loader.context);
    }

    loadModule(id: ModuleId): Module | Promise<Module> {
        const {_modulePromises, _moduleLoaders, _store} = this;

        if (_store.isModuleExist(id)) {
            return _store.findModuleById(id);
        }

        const modulePromise = _modulePromises.find(it => isModulesIdsEqual(id, it.id));

        if (modulePromise) {
            return modulePromise.promise;
        }

        const moduleLoader = _moduleLoaders.find(loader => loader.context === id.context);

        if (!moduleLoader) {
            throw new Error(`Module loader for key ${JSON.stringify(id)} not found`);
        }

        const moduleBody = moduleLoader.loader(id.key);

        const resolveModule = (moduleBody: any): Module => {
            const module: Module = {id, body: moduleBody};
            _store.setModule(module);
            return module;
        };

        if (moduleBody instanceof Promise) {
            const newModulePromise: ModulePromise = {
                id, promise: moduleBody.then(resolveModule)
            };

            newModulePromise.promise.then(() => deleteFromArray(
                this._modulePromises,
                modulePromise => isModulesIdsEqual(modulePromise.id, id)
            ));

            _modulePromises.push(newModulePromise);
            return newModulePromise.promise;
        }

        return resolveModule(moduleBody);
    }

}
