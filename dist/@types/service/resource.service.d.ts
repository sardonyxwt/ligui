import { Resource, ResourceIdentifier, ResourceScope, ResourceScopeAddons, ResourceScopeState } from '../scope/resource.scope';
import { ScopeListener, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
export interface ResourceLoader {
    context: string;
    loader: (key: string) => Promise<any>;
}
export interface ResourcePromise extends ResourceIdentifier {
    promise: Promise<any>;
}
export interface ResourceService extends ResourceScopeAddons {
    registerResourceLoader<T>(loader: ResourceLoader): any;
    loadResource<T>(id: ResourceIdentifier): Promise<T>;
}
export declare class ResourceServiceImpl implements ResourceService {
    protected _scope: ResourceScope;
    protected _resourceLoaders: ResourceLoader[];
    private _resourcePromises;
    constructor(_scope: ResourceScope, _resourceLoaders?: ResourceLoader[]);
    readonly resources: Resource[];
    registerResourceLoader<T>(loader: ResourceLoader): void;
    setResource<T>(resource: Resource<T>): void;
    getResourceData<T>(id: ResourceIdentifier): T;
    isResourceLoaded(id: ResourceIdentifier): boolean;
    onSetResource(listener: ScopeListener<ResourceScopeState>): ScopeListenerUnsubscribeCallback;
    loadResource<T>(id: ResourceIdentifier): Promise<T>;
}
