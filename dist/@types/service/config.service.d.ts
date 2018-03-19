import { Scope } from '@sardonyxwt/state-store';
export interface ConfigServiceState {
    configs: {
        [key: string]: any;
    };
}
export interface ConfigServiceConfig {
    loader: (name: string) => Promise<any>;
    initState?: ConfigServiceState;
}
export interface ConfigService {
    set(name: string, config: any): Promise<ConfigServiceState>;
    get<T = any>(name: string): Promise<T>;
    getScope(): Scope<ConfigServiceState>;
    configure(config: ConfigServiceConfig): any;
}
export declare const CONFIG_SCOPE_NAME = "CONFIG_SCOPE";
export declare const CONFIG_SCOPE_ACTION_LOAD = "LOAD_CONFIG";
export declare const configService: ConfigService;
