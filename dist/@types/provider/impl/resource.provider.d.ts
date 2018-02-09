import { Provider } from '../provider';
export declare type ResourceLoader = (path: string) => Promise<any>;
export interface AddResourceActionProps {
    path: string;
    resource: any;
}
export interface IResourceService {
    load(path: string, isSave?: boolean): Promise<any>;
}
export interface IResourceProviderState {
    resources: {
        [key: string]: any;
    };
}
export interface IResourceProviderConfig {
    loader: ResourceLoader;
    initState?: IResourceProviderState;
}
export declare class ResourceProvider extends Provider<IResourceService, IResourceProviderConfig> {
    private static instance;
    private constructor();
    static readonly INSTANCE: ResourceProvider;
    protected createService(config: IResourceProviderConfig): IResourceService;
}
