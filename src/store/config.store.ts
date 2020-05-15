import { Scope, Store } from '@sardonyxwt/state-store';
import { saveToArray, copyArray } from '@sardonyxwt/utils/object';
import { LIGUI_TYPES } from '../types';

export interface ConfigId {
    readonly key: string;
    readonly context?: string;
}

export interface ConfigData {
    readonly [key: string]: ConfigData | ConfigData[] | any;
}

export interface Config<T extends ConfigData = ConfigData> {
    readonly id: ConfigId;
    readonly data: T;
}

export interface ConfigStoreState {
    readonly configs: Config[];
}

export interface ConfigStore extends Scope<ConfigStoreState> {
    setConfigs(configs: Config[]): void;

    findConfigById<T extends ConfigData = ConfigData>(id: ConfigId): Config<T>;

    isConfigExist(id: ConfigId): boolean;
}

export enum ConfigStoreActions {
    UpdateConfigs = 'CONFIGS_UPDATE'
}

export const createConfigStore = (store: Store, initState: ConfigStoreState) => {
    const configStore = store.createScope({
        name: LIGUI_TYPES.CONFIG_STORE,
        initState: {
            configs: initState.configs || []
        },
        isSubscribedMacroAutoCreateEnabled: true,
    }, true) as ConfigStore;

    configStore.setConfigs = configStore.registerAction(
        ConfigStoreActions.UpdateConfigs,
        (state, configs: Config[]) => {
            const updatedConfigs = copyArray(state.configs);
            configs.forEach(config => saveToArray(
                updatedConfigs, config,
                existConfig => isConfigsIdsEqual(config.id, existConfig.id)
            ));
            return {
                configs: updatedConfigs
            }
        }
    );

    configStore.findConfigById = <T>(id: ConfigId) => {
        return configStore.state.configs.find(config => isConfigsIdsEqual(config.id, id)) as Config<T>;
    };

    configStore.isConfigExist = (id: ConfigId) => {
        return !!configStore.findConfigById(id);
    };

    return configStore;
}

export function isConfigsIdsEqual(configId1: ConfigId, configId2: ConfigId) {
    return configId1.key === configId2.key
        && configId1.context === configId2.context;
}
