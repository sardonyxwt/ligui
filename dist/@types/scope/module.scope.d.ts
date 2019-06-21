import { ScopeListener, Scope, Store, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
export declare const MODULE_SCOPE_NAME = "module";
export declare const MODULE_SCOPE_SET_MODULE_ACTION = "setModule";
export interface ModuleId {
    readonly key: string;
    readonly context: string;
}
export interface Module<T = any> {
    readonly id: ModuleId;
    readonly body: T;
}
export interface ModuleScopeState {
    readonly modules: Module[];
}
export interface ModuleScopeAddons extends ModuleScopeState {
    setModule(module: Module): void;
    getModuleBody<T>(id: ModuleId): T;
    isModuleLoaded(id: ModuleId): boolean;
    onSetModule(listener: ScopeListener<ModuleScopeState>): ScopeListenerUnsubscribeCallback;
}
export interface ModuleScope extends Scope<ModuleScopeState>, ModuleScopeAddons {
}
export interface ModuleScopeOptions {
    initState: ModuleScopeState;
}
export declare const moduleIdComparator: (id1: ModuleId, id2: ModuleId) => boolean;
export declare function createModuleScope(store: Store, { initState }: ModuleScopeOptions): ModuleScope;
