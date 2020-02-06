import { saveToArray } from '@sardonyxwt/utils/object';
import { isModulesIdsEqual, Module, ModuleId, ModuleStore } from '../store/module.store';

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

export class ModuleServiceImpl implements ModuleService {

    private _modulePromises: ModulePromise[] = [];

    constructor(protected _store: ModuleStore,
                protected _moduleLoaders: ModuleLoader[] = []) {
    }

    registerModuleLoader(loader: ModuleLoader) {
        saveToArray(this._moduleLoaders, loader, moduleLoader => moduleLoader.context === loader.context);
        this._modulePromises
            .filter(it => it.id.context === loader.context && !!it.resolver)
            .forEach(it => it.resolver())
    }

    loadModule(id: ModuleId): Promise<Module> {
        const {_modulePromises, _store} = this;

        const modulePromise = this._modulePromises.find(it => isModulesIdsEqual(it.id, id));

        if (modulePromise) {
            return modulePromise.promise;
        }

        if (_store.isModuleExist(id)) {
            const newModulePromise: ModulePromise = {
                id, promise: Promise.resolve(_store.findModuleById(id))
            };
            _modulePromises.push(newModulePromise);
            return newModulePromise.promise;
        }

        const moduleLoader = this._moduleLoaders.find(loader => loader.context === id.context);

        if (!moduleLoader) {
            throw new Error(`ModuleBody loader for key ${JSON.stringify(id)} not found`);
        }

        const newModulePromise: ModulePromise = {
            id, promise: moduleLoader.loader(id.key).then(moduleBody => {
                const module: Module = {id, body: moduleBody};
                _store.setModule(module);
                return module;
            })
        };

        _modulePromises.push(newModulePromise);

        return newModulePromise.promise;
    }

}
