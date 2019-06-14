import autobind from 'autobind-decorator';
import { ModuleScope } from './module.scope';

export type ModuleLoader = (key: string, cb: (module: any) => void) => void;

export interface ModuleService {
  setModule<T>(key: string, module: T): void;
  getModule<T>(key: string): T;
  getLoadedModulesKeys(): string[];
  loadModule<T>(key: string): Promise<T>;
  isModuleLoaded(key: string): boolean;
}

@autobind
export class ModuleServiceImpl implements ModuleService {

  private _modulePromises: {[key: string]: Promise<any>} = {};

  constructor(private _loader: ModuleLoader,
              private _scope: ModuleScope) {}

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
    const {_modulePromises, _loader, _scope} = this;
    const {modules, setModule, getModule} = _scope;

    if (!(key in _modulePromises)) {
      if (modules[key]) {
        _modulePromises[key] = Promise.resolve(getModule(key));
      } else {
        _modulePromises[key] = new Promise(resolve => _loader(key, resolve))
          .then(module => setModule({key, module}));
      }
    }

    return _modulePromises[key];
  }

}
