import { Scope } from '@sardonyxwt/state-store';
export declare type ResourceLoader = (path: string) => Promise<any>;
export interface AddResourceActionProps {
    path: string;
    resource: any;
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
export declare class ResourceService {
    static readonly SCOPE_NAME: string;
    static readonly ADD_RESOURCE_ACTION: string;
    private scope;
    private isConfigured;
    private resourceCache;
    private static instance;
    private constructor();
    static readonly INSTANCE: ResourceService;
    load(path: string, isSave?: boolean): Promise<any>;
    getScope(): Scope<IResourceProviderState>;
    configure(config: IResourceProviderConfig): void;
}
