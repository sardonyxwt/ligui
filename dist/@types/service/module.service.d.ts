import { ModuleScope, ModuleIdentifier, Module, ModuleScopeAddons, ModuleScopeState } from '../scope/module.scope';
import { ScopeListener, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
export interface ModuleLoader {
    context: string;
    loader: (key: string) => Promise<any>;
}
export interface ModulePromise extends ModuleIdentifier {
    promise: Promise<any>;
}
export interface ModuleService extends ModuleScopeAddons {
    registerModuleLoader<T>(loader: ModuleLoader): any;
    loadModule<T>(id: ModuleIdentifier): Promise<T>;
}
export declare class ModuleServiceImpl implements ModuleService {
    protected _scope: ModuleScope;
    protected _moduleLoaders: ModuleLoader[];
    private _modulePromises;
    constructor(_scope: ModuleScope, _moduleLoaders?: ModuleLoader[]);
    readonly modules: Module[];
    registerModuleLoader<T>(loader: ModuleLoader): void;
    setModule<T>(module: Module<T>): void;
    getModuleBody<T>(id: ModuleIdentifier): T;
    isModuleLoaded(id: ModuleIdentifier): boolean;
    onSetModule(listener: ScopeListener<ModuleScopeState>): ScopeListenerUnsubscribeCallback;
    loadModule<T>(id: ModuleIdentifier): Promise<T>;
}
