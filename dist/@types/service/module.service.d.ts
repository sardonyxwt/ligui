import { ModuleScope, ModuleId, Module, ModuleScopeAddons, ModuleScopeState } from '../scope/module.scope';
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
export interface ModuleService extends ModuleScopeAddons {
    registerModuleLoader<T>(loader: ModuleBodyLoader): any;
    loadModule<T>(id: ModuleId): Promise<T>;
}
export declare class ModuleServiceImpl implements ModuleService {
    protected _scope: ModuleScope;
    protected _moduleLoaders: ModuleBodyLoader[];
    private _modulePromises;
    constructor(_scope: ModuleScope, _moduleLoaders?: ModuleBodyLoader[]);
    readonly modules: Module[];
    registerModuleLoader<T>(loader: ModuleBodyLoader): void;
    setModule<T>(module: Module<T>): void;
    getModuleBody<T>(id: ModuleId): T;
    isModuleLoaded(id: ModuleId): boolean;
    onSetModule(listener: ScopeListener<ModuleScopeState>): ScopeListenerUnsubscribeCallback;
    loadModule<T>(id: ModuleId): Promise<T>;
    private getModuleLoader;
    private getModulePromise;
    private createModulePromise;
}
