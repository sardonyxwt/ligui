import { Scope } from '@sardonyxwt/state-store';
export interface ResourceProviderState {
    resources: {
        [key: string]: any;
    };
}
export interface ResourceProviderConfig {
    loader: (path: string) => Promise<any>;
    initState?: ResourceProviderState;
}
export declare class ResourceService {
    static readonly SCOPE_NAME: string;
    static readonly ADD_RESOURCE_ACTION: string;
    private scope;
    private resourceCache;
    private static instance;
    private constructor();
    static readonly INSTANCE: ResourceService;
    set(path: string, resource: any): Promise<ResourceProviderState>;
    get(path: string, isSave?: boolean): Promise<any>;
    getScope(): Scope<ResourceProviderState>;
    configure(config: ResourceProviderConfig): void;
}
