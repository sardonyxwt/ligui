import { SyncScope } from '@sardonyxwt/state-store';
export interface ResourceServiceState {
    resources: {
        [key: string]: any;
    };
}
export interface ResourceServiceConfig {
    loader: (path: string) => Promise<any>;
    initState?: ResourceServiceState;
}
export interface ResourceService {
    set(path: string, resource: any): void;
    get(path: string, isSave?: boolean): Promise<any>;
    getScope(): SyncScope<ResourceServiceState>;
    configure(config: ResourceServiceConfig): void;
}
export declare const RESOURCES_SCOPE_NAME = "RESOURCES_SCOPE";
export declare const RESOURCES_SCOPE_ACTION_ADD = "ADD_RESOURCE";
export declare const resourceService: ResourceService;
