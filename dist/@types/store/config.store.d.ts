import { Repository } from '../service/repository.service';
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
export interface ConfigStoreState {
    readonly configs: Config[];
}
export interface ConfigStore extends ConfigStoreState, Repository<ConfigStoreState> {
    setConfig(...configs: Config[]): void;
    findConfigById(id: ConfigId): Config;
    isConfigExist(id: ConfigId): boolean;
}
export declare class ConfigStoreImpl implements ConfigStore {
    readonly configs: Config[];
    constructor(configs?: Config[]);
    setConfig(...configs: Config[]): void;
    findConfigById(id: ConfigId): Config;
    isConfigExist(id: ConfigId): boolean;
    collect(): ConfigStoreState;
    restore(state: ConfigStoreState): void;
    reset(): void;
}
export declare function isConfigsIdsEqual(configId1: ConfigId, configId2: ConfigId): boolean;
//# sourceMappingURL=config.store.d.ts.map