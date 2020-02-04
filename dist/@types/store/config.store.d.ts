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
export declare class ConfigStoreImpl implements ConfigStore {
    readonly configs: Config[];
    constructor(configs?: Config[]);
    setConfig(...configs: Config[]): void;
    findConfigById(id: ConfigId): Config;
    isConfigExist(id: ConfigId): boolean;
}
export declare function isConfigsIdsEqual(configId1: ConfigId, configId2: ConfigId): boolean;
//# sourceMappingURL=config.store.d.ts.map