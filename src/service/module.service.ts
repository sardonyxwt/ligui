import { inject, injectable } from 'inversify';
import autobind from 'autobind-decorator';
import { LIGUI_TYPES } from '../types';

export type ModuleLoader = (key: string) => any | Promise<any>;

export interface ModuleService {
  setModule<T>(key: string, module: T): void;
  getModule<T>(key: string): T;
  getLoadedModulesKeys(): string[];
  loadModule<T>(key: string): Promise<T>;
  isModuleLoaded(key: string): boolean;
}

@injectable()
@autobind
export class ModuleServiceImpl implements ModuleService {

  private _modules: {[key: string]: any} = {};
  private _modulePromises: {[key: string]: Promise<any>} = {};

  constructor(@inject(LIGUI_TYPES.MODULE_LOADER) private _loader: ModuleLoader) {}

  setModule<T>(key: string, module: T): void {
    this._modules[key] = module;
  }

  getModule<T>(key: string): T {
    return this._modules[key];
  }

  getLoadedModulesKeys(): string[] {
    return Object.getOwnPropertyNames(this._modules);
  }

  isModuleLoaded(key: string): boolean {
    return !!this._modules[key];
  }

  loadModule<T>(key: string): Promise<T> {
    const {_modulePromises, _loader, _modules} = this;

    if (!(key in _modulePromises)) {
      if (_modules[key]) {
        _modulePromises[key] = Promise.resolve(_modules[key]);
      } else {
        _modulePromises[key] = Promise.resolve(_loader(key))
          .then(module => _modules[key] = module);
      }
    }

    return _modulePromises[key];
  }

}
