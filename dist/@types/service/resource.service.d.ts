import { Scope } from '../';
export interface ResourceProviderState {
    resources: {
        [key: string]: any;
    };
}
export interface ResourceProviderConfig {
    loader: (path: string) => Promise<any>;
    initState?: ResourceProviderState;
}
export interface ResourceService {
    set(path: string, resource: any): Promise<ResourceProviderState>;
    get(path: string, isSave?: boolean): Promise<any>;
    getScope(): Scope<ResourceProviderState>;
    configure(config: ResourceProviderConfig): void;
}
export declare const RESOURCES_SCOPE_NAME = "RESOURCES_SCOPE";
export declare const resourceService: ResourceService;
