import { Scope, ScopeListener, ScopeListenerUnsubscribeCallback, Store } from '@sardonyxwt/state-store';
export declare const CONFIG_SCOPE_NAME = "config";
export declare const CONFIG_SCOPE_SET_CONFIG_UNIT_ACTION = "setConfigUnit";
export interface ConfigUnitId {
    readonly key: string;
    readonly context?: string;
}
export interface ConfigUnitData {
    readonly [key: string]: string | number | boolean | string[] | number[] | boolean[] | ConfigUnitData | ConfigUnitData[];
}
export interface ConfigUnit {
    readonly id: ConfigUnitId;
    readonly data: ConfigUnitData;
}
export interface ConfigScopeState {
    readonly configUnits: ConfigUnit[];
}
export interface ConfigScopeExtensions extends ConfigScopeState {
    setConfigUnit(configUnit: ConfigUnit): void;
    getConfigUnitData<T extends ConfigUnitData = ConfigUnitData>(id: ConfigUnitId): T;
    isConfigUnitLoaded(id: ConfigUnitId): boolean;
    onSetConfigUnit(listener: ScopeListener<ConfigScopeState>): ScopeListenerUnsubscribeCallback;
}
export interface ConfigScope extends Scope<ConfigScopeState>, ConfigScopeExtensions {
}
export declare const configUnitIdComparator: (id1: ConfigUnitId, id2: ConfigUnitId) => boolean;
export declare function createConfigScope(store: Store, initState?: ConfigScopeState): ConfigScope;
//# sourceMappingURL=config.scope.d.ts.map