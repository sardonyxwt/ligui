import { ScopeListener } from '@sardonyxwt/state-store';
import { ResourceScope, ResourceScopeAddons, ResourceScopeAddResourceActionProps, ResourceScopeState } from '../scope/resource.scope';
export declare type ResourceLoader = (key: string, cb: (resource: any) => void) => void;
export interface ResourceService extends ResourceScopeAddons {
    loadResources<T>(key: string): Promise<T>;
}
export declare class ResourceServiceImpl implements ResourceService {
    private _loader;
    private _scope;
    private _resourcePromises;
    constructor(_loader: ResourceLoader, _scope: ResourceScope);
    readonly resources: import("../scope/resource.scope").Resources;
    getResource(key: string): any;
    setResource(props: ResourceScopeAddResourceActionProps): void;
    isResourceLoaded(key: string): boolean;
    onSetResource(listener: ScopeListener<ResourceScopeState>): import("@sardonyxwt/state-store").ScopeListenerUnsubscribeCallback;
    loadResources(key: string): Promise<any>;
}
