import { deleteFromArray, saveToArray } from '@source/util/object.utils';
import {
    Config,
    ConfigData,
    ConfigId,
    ConfigStore,
    isConfigsIdsEqual,
} from '@source/store/config.store';

/**
 * @interface ConfigLoader
 * @description Loader for configs from any context.
 */
export interface ConfigLoader {
    readonly context?: string;
    readonly bindingContext?: string;
    readonly loader?: (
        key: string,
        context: string,
    ) => ConfigData | Promise<ConfigData>;
}

interface ConfigPromise {
    readonly id: ConfigId;
    readonly promise: Promise<Config>;
}

/**
 * @interface ConfigService
 * @description Service manage config store.
 */
export interface ConfigService {
    /**
     * @method setConfigLoader
     * @description Add or replace exist config loader.
     * @param loader {ConfigLoader} Loader for replaced or added.
     */
    setConfigLoader(loader: ConfigLoader): void;

    /**
     * @method getConfigLoader
     * @description Return config loader with same context.
     * @param context {string} Context for loader.
     * @returns {ConfigLoader}
     */
    getConfigLoader(context?: string): ConfigLoader;

    /**
     * @method loadConfig
     * @description Load config used loader.
     * @param id {ConfigId} for loader.
     * @returns {Config<T> | Promise<Config<T>>}
     */
    loadConfig<T extends ConfigData>(
        id: ConfigId,
    ): Config<T> | Promise<Config<T>>;
}

/**
 * @class ConfigServiceImpl
 * @description Default realization of ConfigService.
 * You can replace it after core instance created.
 */
export class ConfigServiceImpl implements ConfigService {
    private _configPromises: ConfigPromise[] = [];

    constructor(
        protected _store: ConfigStore,
        protected _configLoaders: ConfigLoader[] = [],
    ) {}

    setConfigLoader(loader: ConfigLoader): void {
        if (!!loader.loader === !!loader.bindingContext) {
            throw new Error('You need set loader or bindingContext');
        }
        deleteFromArray(
            this._configPromises,
            (configPromise) => configPromise.id.context === loader.context,
        );
        saveToArray(
            this._configLoaders,
            loader,
            (configLoader) => configLoader.context === loader.context,
        );
    }

    getConfigLoader(context?: string): ConfigLoader {
        const loader = this._configLoaders.find(
            (loader) => loader.context === context,
        );
        if (loader.bindingContext) {
            return this.getConfigLoader(loader.bindingContext);
        }
        return loader;
    }

    loadConfig<T extends ConfigData>(
        id: ConfigId,
    ): Config<T> | Promise<Config<T>> {
        const { _configPromises, _store } = this;

        if (_store.isConfigExist(id)) {
            return _store.findConfigById(id);
        }

        const configPromise = _configPromises.find((it) =>
            isConfigsIdsEqual(id, it.id),
        );

        if (configPromise) {
            return configPromise.promise as Promise<Config<T>>;
        }

        const configLoader = this.getConfigLoader(id.context);

        if (!configLoader) {
            throw new Error(
                `Config loader for key ${JSON.stringify(id)} not found`,
            );
        }

        const configData = configLoader.loader(id.key, id.context) as T;

        const resolveConfig = (configData: T): Config<T> => {
            const config: Config<T> = { id, data: configData };
            _store.setConfigs([config]);
            return config;
        };

        if (configData instanceof Promise) {
            const newConfigPromise: ConfigPromise = {
                id,
                promise: configData.then(resolveConfig),
            };

            newConfigPromise.promise.then(() =>
                deleteFromArray(this._configPromises, (configPromise) =>
                    isConfigsIdsEqual(configPromise.id, id),
                ),
            );

            _configPromises.push(newConfigPromise);
            return newConfigPromise.promise as Promise<Config<T>>;
        }

        return resolveConfig(configData);
    }
}
