import { Provider } from '../provider';
export interface IConfigService {
    get<T = any>(name: string): Promise<T>;
}
export interface IConfigProviderState {
    configs: {
        [key: string]: any;
    };
}
export interface IConfigProviderConfig {
    loader: <T = any>(name: string) => Promise<T>;
    initState?: IConfigProviderState;
}
export declare class ConfigProvider extends Provider<IConfigService, IConfigProviderConfig> {
    private static instance;
    private constructor();
    static readonly INSTANCE: ConfigProvider;
    protected createService(config: IConfigProviderConfig): IConfigService;
}
