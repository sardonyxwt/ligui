import { Scope } from '@core';
export interface ConfigProviderState {
    configs: {
        [key: string]: any;
    };
}
export interface ConfigProviderConfig {
    loader: (name: string) => Promise<any>;
    initState?: ConfigProviderState;
}
export interface ConfigService {
    set(name: string, config: any): Promise<ConfigProviderState>;
    get<T = any>(name: string): Promise<T>;
    getScope(): Scope<ConfigProviderState>;
    configure(config: ConfigProviderConfig): any;
}
export declare const CONFIG_SCOPE_NAME = "CONFIG_SCOPE";
export declare const CONFIG_SCOPE_ACTION_LOAD = "LOAD_CONFIG";
export declare const configService: ConfigService;
