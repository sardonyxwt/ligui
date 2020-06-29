import { Config, ConfigData, ConfigId, ConfigStore } from '../store/config.store';
export interface ConfigLoader {
    readonly context?: string;
    readonly loader: (key: string) => ConfigData | Promise<ConfigData>;
}
export interface ConfigPromise {
    readonly id: ConfigId;
    readonly promise: Promise<Config>;
}
export interface ConfigService {
    setConfigLoader(loader: ConfigLoader): void;
    getConfigLoader(context?: string): ConfigLoader;
    loadConfig<T extends ConfigData>(id: ConfigId): Config<T> | Promise<Config<T>>;
}
export declare class ConfigServiceImpl implements ConfigService {
    protected _store: ConfigStore;
    protected _configLoaders: ConfigLoader[];
    private _configPromises;
    constructor(_store: ConfigStore, _configLoaders?: ConfigLoader[]);
    setConfigLoader(loader: ConfigLoader): void;
    getConfigLoader(context?: string): ConfigLoader;
    loadConfig<T extends ConfigData>(id: ConfigId): Config<T> | Promise<Config<T>>;
}
