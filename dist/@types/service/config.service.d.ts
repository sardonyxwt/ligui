import { Scope } from '@sardonyxwt/state-store';
export interface IConfigProviderState {
    configs: {
        [key: string]: any;
    };
}
export interface IConfigProviderConfig {
    loader: (name: string) => Promise<any>;
    initState?: IConfigProviderState;
}
export declare class ConfigService {
    static readonly SCOPE_NAME: string;
    static readonly LOAD_CONFIG_ACTION: string;
    private scope;
    private isConfigured;
    private static instance;
    private constructor();
    static readonly INSTANCE: ConfigService;
    get<T>(name: string): Promise<T>;
    getScope(): Scope<IConfigProviderState>;
    configure(config: IConfigProviderConfig): void;
}
