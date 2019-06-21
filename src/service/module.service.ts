import { ModuleScope, ModuleId, Module, moduleIdComparator, ModuleScopeAddons, ModuleScopeState } from '../scope/module.scope';
import { deleteFromArray, saveToArray } from '../extension/util.extension';
import { ScopeListener, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';

export interface ModuleLoader {
  readonly context: string;
  readonly loader: (key: string) => Promise<any>;
}

export interface ModulePromise {
  readonly id: ModuleId;
  readonly promise: Promise<any>;
}

export interface ModuleService extends ModuleScopeAddons {
  registerModuleLoader<T>(loader: ModuleLoader);
  loadModule<T>(id: ModuleId): Promise<T>;
}

export class ModuleServiceImpl implements ModuleService {

  private _modulePromises: ModulePromise[] = [];

  constructor(protected _scope: ModuleScope,
              protected _moduleLoaders: ModuleLoader[] = []) {}

  get modules(): Module[] {
    return this._scope.modules;
  }

  registerModuleLoader<T>(loader: ModuleLoader) {
    deleteFromArray(this._modulePromises, modulePromise => modulePromise.id.context === loader.context);
    saveToArray(this._moduleLoaders, loader, moduleLoader => moduleLoader.context === loader.context);
  }

  setModule<T>(module: Module<T>): void {
    this._scope.setModule(module);
  }

  getModuleBody<T>(id: ModuleId): T {
    return this._scope.getModuleBody(id);
  }

  isModuleLoaded(id: ModuleId): boolean {
    return this._scope.isModuleLoaded(id);
  }

  onSetModule(listener: ScopeListener<ModuleScopeState>): ScopeListenerUnsubscribeCallback {
    return this._scope.onSetModule(listener);
  }

  loadModule<T>(id: ModuleId): Promise<T> {
    const {_modulePromises, _moduleLoaders, _scope} = this;
    const {setModule, getModuleBody} = _scope;

    const modulePromise = _modulePromises.find(it => moduleIdComparator(id, it.id));

    if (modulePromise) {
      return modulePromise.promise;
    }

    const moduleBody = getModuleBody(id);

    if (moduleBody) {
      const newModulePromise: ModulePromise = {
        id, promise: Promise.resolve(moduleBody)
      };
      _modulePromises.push(newModulePromise);
      return newModulePromise.promise;
    }

    const moduleLoader = _moduleLoaders.find(it => it.context === id.context);

    if (!moduleLoader) {
      throw new Error(`Module loader for key ${JSON.stringify(id)} not found`);
    }

    const newModulePromise: ModulePromise = {
      id, promise: moduleLoader.loader(id.key).then(moduleBody => {
        setModule({id, body: moduleBody});
        return moduleBody;
      })
    };

    _modulePromises.push(newModulePromise);

    return newModulePromise.promise;
  }

}
