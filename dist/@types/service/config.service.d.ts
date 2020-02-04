import { Config, ConfigData, ConfigId, ConfigStore } from '../store/config.store';
export interface ConfigLoader {
    readonly context?: string;
    readonly loader: (key: string) => Promise<ConfigData>;
}
export interface ConfigPromise {
    readonly id: ConfigId;
    readonly promise: Promise<Config>;
}
export interface ConfigService {
    registerConfigLoader(loader: ConfigLoader): void;
    loadConfig(id: ConfigId): Promise<Config>;
}
export declare class ConfigServiceImpl implements ConfigService {
    protected _store: ConfigStore;
    protected _configLoaders: ConfigLoader[];
    private _configPromises;
    constructor(_store: ConfigStore, _configLoaders?: ConfigLoader[]);
    registerConfigLoader(loader: ConfigLoader): void;
    loadConfig(id: ConfigId): Promise<Config>;
}
//# sourceMappingURL=config.service.d.ts.map