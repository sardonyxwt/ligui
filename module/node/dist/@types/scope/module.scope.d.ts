import { ScopeListener, Scope, Store, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
export declare const MODULE_SCOPE_NAME = "module";
export declare const MODULE_SCOPE_SET_MODULE_ACTION = "setModule";
export interface ModuleScopeState {
    readonly modules: {
        [key: string]: () => any;
    };
}
export interface ModuleScopeSetModuleActionProps {
    key: string;
    module: any;
}
export interface ModuleScopeAddons extends ModuleScopeState {
    setModule(props: ModuleScopeSetModuleActionProps): void;
    getModule(key: string): any;
    isModuleLoaded(key: string): boolean;
    onAddModule(listener: ScopeListener<ModuleScopeState>): ScopeListenerUnsubscribeCallback;
}
export interface ModuleScope extends Scope<ModuleScopeState>, ModuleScopeAddons {
}
export declare function createModuleScope(store: Store): ModuleScope;
