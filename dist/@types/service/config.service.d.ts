import { Scope } from '@sardonyxwt/state-store';
export interface ConfigProviderState {
    configs: {
        [key: string]: any;
    };
}
export interface ConfigProviderConfig {
    loader: (name: string) => Promise<any>;
    initState?: ConfigProviderState;
}
export declare class ConfigService {
    static readonly SCOPE_NAME: string;
    static readonly ADD_CONFIG_ACTION: string;
    private scope;
    private configCache;
    private static instance;
    private constructor();
    static readonly INSTANCE: ConfigService;
    set(name: string, config: any): Promise<ConfigProviderState>;
    get(name: string): Promise<any>;
    getScope(): Scope<ConfigProviderState>;
    configure(config: ConfigProviderConfig): void;
}
