import { observable, action } from 'mobx';
import { saveToArray } from '@sardonyxwt/utils/object';

export interface ConfigId {
    readonly key: string;
    readonly context?: string;
}

export interface ConfigData {
    readonly [key: string]: string | number | boolean | string[] | number[] | boolean[] | ConfigData | ConfigData[];
}

export interface Config {
    readonly id: ConfigId;
    readonly data: ConfigData;
}

export interface ConfigStore {
    readonly configs: Config[];

    setConfig(...configs: Config[]): void;

    findConfigById(id: ConfigId): Config;

    isConfigExist(id: ConfigId): boolean;
}

export class ConfigStoreImpl implements ConfigStore {

    @observable.shallow readonly configs: Config[] = [];

    constructor(configs: Config[] = []) {
        this.configs.push(...configs);
    }

    @action setConfig(...configs: Config[]): void {
        configs.forEach(config => saveToArray(
            this.configs, config,
            existConfig => isConfigsIdsEqual(config.id, existConfig.id)
        ));
    }

    findConfigById(id: ConfigId): Config {
        return this.configs.find(config => isConfigsIdsEqual(config.id, id));
    }

    isConfigExist(id: ConfigId): boolean {
        return !!this.findConfigById(id);
    }

}

export function isConfigsIdsEqual(configId1: ConfigId, configId2: ConfigId) {
    return configId1.key === configId2.key
        && configId1.context === configId2.context;
}
