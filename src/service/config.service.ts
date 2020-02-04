import autobind from 'autobind-decorator';
import { deleteFromArray, saveToArray } from '@sardonyxwt/utils/object';
import { Config, ConfigData, ConfigId, ConfigStore, isConfigsIdsEqual } from '../store/config.store';

export interface ConfigLoader {
    readonly context?: string;
    readonly loader: (key: string) => Promise<ConfigData>;
}

export interface ConfigPromise {
    readonly id: ConfigId
    readonly promise: Promise<Config>;
}

export interface ConfigService {
    registerConfigLoader(loader: ConfigLoader): void;
    loadConfig(id: ConfigId): Promise<Config>;
}

@autobind
export class ConfigServiceImpl implements ConfigService {

    private _configPromises: ConfigPromise[] = [];

    constructor(protected _store: ConfigStore,
                protected _configLoaders: ConfigLoader[] = []) {
    }

    registerConfigLoader(loader: ConfigLoader) {
        deleteFromArray(this._configPromises, modulePromise => modulePromise.id.context === loader.context);
        saveToArray(this._configLoaders, loader, moduleLoader => moduleLoader.context === loader.context);
    }

    loadConfig(id: ConfigId): Promise<Config> {
        const {_configPromises, _configLoaders, _store} = this;

        const configPromise = _configPromises.find(it => isConfigsIdsEqual(id, it.id));

        if (configPromise) {
            return configPromise.promise;
        }

        if (_store.isConfigExist(id)) {
            const newConfigDataPromise: ConfigPromise = {
                id, promise: Promise.resolve(_store.findConfigById(id))
            };
            _configPromises.push(newConfigDataPromise);
            return newConfigDataPromise.promise;
        }

        const configLoader = _configLoaders.find(loader => loader.context === id.context);

        if (!configLoader) {
            throw new Error(`ConfigData loader for key ${JSON.stringify(id)} not found`);
        }

        const newConfigPromise: ConfigPromise = {
            id, promise: configLoader.loader(id.key).then(configData => {
                const config: Config = {id, data: configData};
                _store.setConfig(config);
                return config;
            })
        };

        _configPromises.push(newConfigPromise);

        return newConfigPromise.promise;
    }

}
