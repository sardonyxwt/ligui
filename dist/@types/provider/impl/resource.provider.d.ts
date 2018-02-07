export declare type ResourceLoader = (path: string) => Promise<any>;
export declare type ResourceConverter = (source: string) => Promise<any>;
import { Provider } from '../provider';
export interface IResourceService {
    load(path: string, converter: string | string[]): Promise<any>;
}
export interface IResourceProviderConfig {
    loaders: {
        [key: string]: ResourceLoader;
    };
    converters: {
        [key: string]: ResourceConverter;
    };
}
export declare class ResourceProvider extends Provider<IResourceService, IResourceProviderConfig> {
    private static instance;
    private constructor();
    static readonly INSTANCE: ResourceProvider;
    createService(config: IResourceProviderConfig): IResourceService;
}
