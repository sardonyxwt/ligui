import { Module, ModuleId, ModuleScope, ModuleScopeExtensions, ModuleScopeState } from '../scope/module.scope';
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
export declare class ModuleServiceImpl implements ModuleService {
    protected _scope: ModuleScope;
    protected _moduleLoaders: ModuleBodyLoader[];
    private _modulePromises;
    constructor(_scope: ModuleScope, _moduleLoaders?: ModuleBodyLoader[]);
    readonly modules: Module[];
    registerModuleBodyLoader<T>(loader: ModuleBodyLoader): void;
    setModule<T>(module: Module<T>): void;
    getModuleBody<T>(id: ModuleId): T;
    isModuleLoaded(id: ModuleId): boolean;
    onSetModule(listener: ScopeListener<ModuleScopeState>): ScopeListenerUnsubscribeCallback;
    loadModuleBody<T>(id: ModuleId): Promise<T>;
    private getModuleLoader;
    private getModulePromise;
    private createModulePromise;
}
//# sourceMappingURL=module.service.d.ts.map