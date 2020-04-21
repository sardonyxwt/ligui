import { observable, action, toJS } from 'mobx';
import { saveToArray } from '@sardonyxwt/utils/object';
import { Repository } from '../service/repository.service';

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

export interface ConfigStore extends ConfigStoreState, Repository<ConfigStoreState> {
    setConfig(...configs: Config[]): void;

    findConfigById<T extends ConfigData = ConfigData>(id: ConfigId): Config<T>;

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

    findConfigById<T extends ConfigData = ConfigData>(id: ConfigId): Config<T> {
        return this.configs.find(config => isConfigsIdsEqual(config.id, id)) as Config<T>;
    }

    isConfigExist(id: ConfigId): boolean {
        return !!this.findConfigById(id);
    }

    collect(): ConfigStoreState {
        return {
            configs: toJS(this.configs)
        };
    }

    restore(state: ConfigStoreState): void {
        this.configs.splice(0, this.configs.length);
        this.configs.push(...state.configs);
    }

    reset(): void {
        this.configs.splice(0, this.configs.length);
    }

}

export function isConfigsIdsEqual(configId1: ConfigId, configId2: ConfigId) {
    return configId1.key === configId2.key
        && configId1.context === configId2.context;
}
