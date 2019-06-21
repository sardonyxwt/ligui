import { Resource, ResourceId, ResourceScope, ResourceScopeAddons, ResourceScopeState } from '../scope/resource.scope';
import { ScopeListener, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
export interface ResourceLoader {
    readonly context: string;
    readonly loader: (key: string) => Promise<any>;
}
export interface ResourcePromise {
    readonly id: ResourceId;
    readonly promise: Promise<any>;
}
export interface ResourceService extends ResourceScopeAddons {
    registerResourceLoader<T>(loader: ResourceLoader): any;
    loadResource<T>(id: ResourceId): Promise<T>;
}
export declare class ResourceServiceImpl implements ResourceService {
    protected _scope: ResourceScope;
    protected _resourceLoaders: ResourceLoader[];
    private _resourcePromises;
    constructor(_scope: ResourceScope, _resourceLoaders?: ResourceLoader[]);
    readonly resources: Resource[];
    registerResourceLoader<T>(loader: ResourceLoader): void;
    setResource<T>(resource: Resource<T>): void;
    getResourceData<T>(id: ResourceId): T;
    isResourceLoaded(id: ResourceId): boolean;
    onSetResource(listener: ScopeListener<ResourceScopeState>): ScopeListenerUnsubscribeCallback;
    loadResource<T>(id: ResourceId): Promise<T>;
}
