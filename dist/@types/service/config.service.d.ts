import { ScopeListener, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
import { ConfigScope, ConfigScopeExtensions, ConfigScopeState, ConfigUnit, ConfigUnitData, ConfigUnitId } from '../scope/config.scope';
export interface ConfigUnitDataLoader {
    readonly context?: string;
    readonly loader: (key: string) => Promise<ConfigUnitData>;
}
export interface ConfigUnitDataPromise<T = any> {
    readonly id: ConfigUnitId;
    readonly promise: Promise<T>;
}
export interface ConfigService extends ConfigScopeExtensions {
    registerConfigUnitDataLoader<T>(loader: ConfigUnitDataLoader): void;
    loadConfigUnitData<T extends ConfigUnitData = ConfigUnitData>(id: ConfigUnitId): Promise<T>;
}
export declare class ConfigServiceImpl implements ConfigService {
    protected _scope: ConfigScope;
    protected _configUnitLoaders: ConfigUnitDataLoader[];
    private _configUnitPromises;
    constructor(_scope: ConfigScope, _configUnitLoaders?: ConfigUnitDataLoader[]);
    get configUnits(): ConfigUnit[];
    registerConfigUnitDataLoader<T>(loader: ConfigUnitDataLoader): void;
    setConfigUnit(configUnit: ConfigUnit): void;
    getConfigUnitData<T extends ConfigUnitData = ConfigUnitData>(id: ConfigUnitId): T;
    onSetConfigUnit(listener: ScopeListener<ConfigScopeState>): ScopeListenerUnsubscribeCallback;
    isConfigUnitLoaded(id: ConfigUnitId): boolean;
    loadConfigUnitData<T extends ConfigUnitData = ConfigUnitData>(id: ConfigUnitId): Promise<T>;
}
//# sourceMappingURL=config.service.d.ts.map