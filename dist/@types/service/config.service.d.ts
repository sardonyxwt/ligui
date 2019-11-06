import { ScopeListener, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
import { ConfigScope, ConfigScopeExtensions, ConfigScopeState, ConfigUnit, ConfigUnitData, ConfigUnitId } from '../scope/config.scope';
export interface ConfigUnitDataLoader {
    readonly context?: string;
    readonly loader: (key: string) => Promise<ConfigUnitData>;
}
export interface ConfigUnitDataPromise {
    readonly id: ConfigUnitId;
    readonly promise: Promise<any>;
}
export interface ConfigService extends ConfigScopeExtensions {
    registerConfigUnitDataLoader<T>(loader: ConfigUnitDataLoader): void;
    loadConfigUnitData(id: ConfigUnitId): Promise<ConfigUnitData>;
}
export declare class ConfigServiceImpl implements ConfigService {
    protected _scope: ConfigScope;
    protected _configUnitLoaders: ConfigUnitDataLoader[];
    private _configUnitPromises;
    constructor(_scope: ConfigScope, _configUnitLoaders?: ConfigUnitDataLoader[]);
    readonly configUnits: ConfigUnit[];
    registerConfigUnitDataLoader<T>(loader: ConfigUnitDataLoader): void;
    setConfigUnit(configUnit: ConfigUnit): void;
    getConfigUnitData(id: ConfigUnitId): ConfigUnitData;
    onSetConfigUnit(listener: ScopeListener<ConfigScopeState>): ScopeListenerUnsubscribeCallback;
    isConfigUnitLoaded(id: ConfigUnitId): boolean;
    loadConfigUnitData(id: ConfigUnitId): Promise<ConfigUnitData>;
}
//# sourceMappingURL=config.service.d.ts.map