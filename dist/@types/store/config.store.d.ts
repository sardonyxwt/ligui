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
export declare class ConfigStoreImpl implements ConfigStore {
    readonly configs: Config[];
    constructor(configs?: Config[]);
    setConfig(...configs: Config[]): void;
    findConfigById<T extends ConfigData = ConfigData>(id: ConfigId): Config<T>;
    isConfigExist(id: ConfigId): boolean;
    collect(): ConfigStoreState;
    restore(state: ConfigStoreState): void;
    reset(): void;
}
export declare function isConfigsIdsEqual(configId1: ConfigId, configId2: ConfigId): boolean;
//# sourceMappingURL=config.store.d.ts.map