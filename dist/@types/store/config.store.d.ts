import { Scope, Store } from '@sardonyxwt/state-store';
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
export declare enum ConfigStoreActions {
    UpdateConfigs = "CONFIGS_UPDATE"
}
export declare const createConfigStore: (store: Store, initState: ConfigStoreState) => ConfigStore;
export declare function isConfigsIdsEqual(configId1: ConfigId, configId2: ConfigId): boolean;
//# sourceMappingURL=config.store.d.ts.map