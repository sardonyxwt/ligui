import { inject, multiInject, injectable, optional } from 'inversify';
import { LIGUI_TYPES } from '../types';
import { ModuleScope } from '../scope/module.scope';
import { deleteFromArray, saveToArray } from '../extension/util.extension';

export interface ModuleLoader {
  key: string;
  loader: () => Promise<any>;
}

export interface ModulePromise {
  key: string;
  promise: Promise<any>;
}

export interface ModuleService {
  setModuleLoader<T>(loader: ModuleLoader)
  setModule<T>(key: string, module: T): void;
  getModule<T>(key: string): T;
  getLoadedModulesKeys(): string[];
  loadModule<T>(key: string): Promise<T>;
  isModuleLoaded(key: string): boolean;
}

@injectable()
export class ModuleServiceImpl implements ModuleService {

  private _modulePromises: ModulePromise[] = [];

  constructor(@inject(LIGUI_TYPES.MODULE_SCOPE) protected _scope: ModuleScope,
              @multiInject(LIGUI_TYPES.MODULE_LOADER) @optional() private _moduleLoaders: ModuleLoader[] = []) {}

  setModuleLoader<T>(loader: ModuleLoader) {
    deleteFromArray(this._modulePromises, it => it.key === loader.key);
    saveToArray(this._moduleLoaders, loader, it => it.key === loader.key);
  }

  setModule<T>(key: string, module: T): void {
    this._scope.setModule({key, module});
  }

  getModule<T>(key: string): T {
    return this._scope.getModule(key);
  }

  getLoadedModulesKeys(): string[] {
    return Object.getOwnPropertyNames(this._scope.modules);
  }

  isModuleLoaded(key: string): boolean {
    return this._scope.isModuleLoaded(key);
  }

  loadModule<T>(key: string): Promise<T> {
    const {_modulePromises, _moduleLoaders, _scope} = this;
    const {modules, setModule, getModule} = _scope;

    const modulePromise = _modulePromises.find(it => it.key === key);

    if (!modulePromise) {
      if (modules[key]) {
        _modulePromises.push({
          key, promise: Promise.resolve(getModule(key))
        });
      } else {
        const moduleLoader = _moduleLoaders.find(it => it.key === key);
        if (!moduleLoader) {
          throw new Error(`Module loader for key ${key} not found`);
        }
        _modulePromises.push({
          key, promise: moduleLoader.loader()
            .then(module => {
              setModule({key, module});
              return module;
            })
        });
      }
    }

    return modulePromise.promise;
  }

}
