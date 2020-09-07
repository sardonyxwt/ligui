import { Scope, Store } from '@sardonyxwt/state-store';
import { saveToArray, copyArray } from '@source/util/object.utils';
import { CoreTypes } from '@source/types';

/**
 * @interface ConfigId
 * @description ConfigId identify config in store.
 */
export interface ConfigId {
    /**
     * @field key
     * @description Unique key in context.
     */
    readonly key: string;
    /**
     * @field context
     * @description Unique context in application.
     * Used to select loader for config.
     */
    readonly context?: string;
}

export type ConfigData = Record<string, unknown>;

/**
 * @interface Config
 * @description Config instance in store.
 */
export interface Config<T extends ConfigData = ConfigData> {
    /**
     * @field id
     * @description Unique pair of key and context.
     */
    readonly id: ConfigId;
    /**
     * @field data
     * @description Config data.
     */
    readonly data: T;
}

/**
 * @interface ConfigStoreState
 * @description Config store state.
 */
export interface ConfigStoreState {
    readonly configs: Config[];
}

/**
 * @interface ConfigStore
 * @description Store for configs.
 */
export interface ConfigStore extends Scope<ConfigStoreState> {
    /**
     * @method setConfigs
     * @description Add or replace configs in store.
     * @param configs {Config[]} Configs to be added or replaced.
     */
    setConfigs(configs: Config[]): void;

    /**
     * @method findConfigById
     * @description Return config with same id.
     * @param id {ConfigId} Id used to find config in store.
     * @returns {Config<T>}
     */
    findConfigById<T extends ConfigData = ConfigData>(id: ConfigId): Config<T>;

    /**
     * @method isConfigExist
     * @description Check is config with same id present in store.
     * @param id {ConfigId} Id used to check config present in store.
     * @returns {boolean}
     */
    isConfigExist(id: ConfigId): boolean;
}

export enum ConfigStoreActions {
    UpdateConfigs = 'UpdatesConfigs',
}

export const createConfigStore = (
    store: Store,
    initState: ConfigStoreState,
): ConfigStore => {
    const configStore = store.createScope(
        {
            name: CoreTypes.ConfigStore,
            initState: {
                configs: initState.configs || [],
            },
            isSubscribedMacroAutoCreateEnabled: true,
        },
        true,
    ) as ConfigStore;

    configStore.setConfigs = configStore.registerAction(
        ConfigStoreActions.UpdateConfigs,
        (state, configs: Config[]) => {
            const updatedConfigs = copyArray(state.configs);
            configs.forEach((config) =>
                saveToArray(updatedConfigs, config, (existConfig) =>
                    isConfigsIdsEqual(config.id, existConfig.id),
                ),
            );
            return {
                configs: updatedConfigs,
            };
        },
    );

    configStore.findConfigById = <T extends ConfigData>(id: ConfigId) => {
        return configStore.state.configs.find((config) =>
            isConfigsIdsEqual(config.id, id),
        ) as Config<T>;
    };

    configStore.isConfigExist = (id: ConfigId) => {
        return !!configStore.findConfigById(id);
    };

    return configStore;
};

/**
 * @function isConfigsIdsEqual
 * @description Check is configs ids is equals.
 * @param configId1 {ConfigId} First config id to check equals.
 * @param configId2 {ConfigId} Second config id to check equals.
 * @returns {boolean}
 */
export function isConfigsIdsEqual(
    configId1: ConfigId,
    configId2: ConfigId,
): boolean {
    return (
        configId1.key === configId2.key &&
        configId1.context === configId2.context
    );
}
