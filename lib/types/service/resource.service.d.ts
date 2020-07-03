import { Resource, ResourceId, ResourceStore } from "../store/resource.store";
export interface ResourceLoader {
    readonly context?: string;
    readonly loader: (key: string) => unknown | Promise<unknown>;
}
export interface ResourcePromise {
    readonly id: ResourceId;
    readonly promise: Promise<unknown>;
}
export interface ResourceService {
    setResourceLoader(loader: ResourceLoader): void;
    getResourceLoader(context?: string): ResourceLoader;
    loadResource<T = unknown>(id: ResourceId): Resource<T> | Promise<Resource<T>>;
}
export declare class ResourceServiceImpl implements ResourceService {
    protected _store: ResourceStore;
    protected _resourceLoaders: ResourceLoader[];
    private _resourcePromises;
    constructor(_store: ResourceStore, _resourceLoaders?: ResourceLoader[]);
    setResourceLoader(loader: ResourceLoader): void;
    getResourceLoader(context?: string): ResourceLoader;
    loadResource<T = unknown>(id: ResourceId): Resource<T> | Promise<Resource<T>>;
}
