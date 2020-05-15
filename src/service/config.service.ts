import { deleteFromArray, saveToArray } from '@sardonyxwt/utils/object';
import { Config, ConfigData, ConfigId, ConfigStore, isConfigsIdsEqual } from '../store/config.store';

export interface ConfigLoader {
    readonly context?: string;
    readonly loader: (key: string) => ConfigData | Promise<ConfigData>;
}

export interface ConfigPromise {
    readonly id: ConfigId
    readonly promise: Promise<Config>;
}

export interface ConfigService {
    setConfigLoader(loader: ConfigLoader): void;
    getConfigLoader(context?: string): ConfigLoader;

    loadConfig<T extends ConfigData>(id: ConfigId): Config<T> | Promise<Config<T>>;
}

export class ConfigServiceImpl implements ConfigService {

    private _configPromises: ConfigPromise[] = [];

    constructor(protected _store: ConfigStore,
                protected _configLoaders: ConfigLoader[] = []) {
    }

    setConfigLoader(loader: ConfigLoader): void {
        deleteFromArray(this._configPromises, configPromise => configPromise.id.context === loader.context);
        saveToArray(this._configLoaders, loader, configLoader => configLoader.context === loader.context);
    }

    getConfigLoader(context?: string): ConfigLoader {
        return this._configLoaders.find(loader => loader.context === context);
    }

    loadConfig<T extends ConfigData>(id: ConfigId): Config<T> | Promise<Config<T>> {
        const {_configPromises, _configLoaders, _store} = this;

        if (_store.isConfigExist(id)) {
            return _store.findConfigById(id);
        }

        const configPromise = _configPromises.find(it => isConfigsIdsEqual(id, it.id));

        if (configPromise) {
            return configPromise.promise as Promise<Config<T>>;
        }

        const configLoader = _configLoaders.find(loader => loader.context === id.context);

        if (!configLoader) {
            throw new Error(`Config loader for key ${JSON.stringify(id)} not found`);
        }

        const configData = configLoader.loader(id.key) as T;

        const resolveConfig = (configData: T): Config<T> => {
            const config: Config<T> = {id, data: configData};
            _store.setConfigs([config]);
            return config;
        };

        if (configData instanceof Promise) {
            const newConfigPromise: ConfigPromise = {
                id, promise: configData.then(resolveConfig)
            };

            newConfigPromise.promise.then(() => deleteFromArray(
                this._configPromises,
                configPromise => isConfigsIdsEqual(configPromise.id, id)
            ));

            _configPromises.push(newConfigPromise);
            return newConfigPromise.promise as Promise<Config<T>>;
        }

        return resolveConfig(configData);
    }

}
