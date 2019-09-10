import { Module, ModuleId, ModuleScope, ModuleScopeExtensions, ModuleScopeState } from '../scope/module.scope';
import { saveToArray } from '@sardonyxwt/utils/object';
import { ScopeListener, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';

export interface ModuleBodyLoader {
    readonly context?: string;
    readonly loader: (key: string) => Promise<any>;
}

export interface ModulePromise {
    readonly id: ModuleId;
    readonly resolver?: () => void;
    readonly promise: Promise<any>;
}

export interface ModuleService extends ModuleScopeExtensions {
    registerModuleBodyLoader<T>(loader: ModuleBodyLoader): void;

    loadModuleBody<T>(id: ModuleId): Promise<T>;
}

export class ModuleServiceImpl implements ModuleService {

    private _modulePromises: ModulePromise[] = [];

    constructor(protected _scope: ModuleScope,
                protected _moduleLoaders: ModuleBodyLoader[] = []) {
    }

    get modules(): Module[] {
        return this._scope.modules;
    }

    registerModuleBodyLoader<T>(loader: ModuleBodyLoader) {
        saveToArray(this._moduleLoaders, loader, moduleLoader => moduleLoader.context === loader.context);
        this._modulePromises
            .filter(it => it.id.context === loader.context && !!it.resolver)
            .forEach(it => it.resolver())
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

    loadModuleBody<T>(id: ModuleId): Promise<T> {
        const {_modulePromises, _scope} = this;

        const modulePromise = this.getModulePromise(id);

        if (modulePromise) {
            return modulePromise.promise;
        }

        const moduleBody = _scope.getModuleBody(id);

        if (moduleBody) {
            const newModulePromise: ModulePromise = {
                id, promise: Promise.resolve(moduleBody)
            };
            _modulePromises.push(newModulePromise);
            return newModulePromise.promise;
        }

        let resolver: () => void = null;
        let promise: Promise<any> = null;

        const moduleLoader = this.getModuleLoader(id.context);

        if (moduleLoader) {
            promise = this.createModulePromise(id, moduleLoader);
        } else {
            promise = new Promise(resolve => {
                resolver = () => {
                    this.createModulePromise(id, this.getModuleLoader(id.context)).then(resolve);
                }
            });
        }

        let newModulePromise: ModulePromise = {
            id, resolver, promise
        };

        _modulePromises.push(newModulePromise);

        return newModulePromise.promise;
    }

    private getModuleLoader(context: string) {
        return this._moduleLoaders.find(it => it.context === context);
    }

    private getModulePromise(id: ModuleId) {
        return this._modulePromises.find(it => it.id === id);
    }

    private createModulePromise(id: ModuleId, loader: ModuleBodyLoader) {
        return loader.loader(id.key).then(moduleBody => {
            this.setModule({id, body: moduleBody});
            return moduleBody;
        })
    }

}
