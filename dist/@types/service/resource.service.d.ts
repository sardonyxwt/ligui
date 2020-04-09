import { Resource, ResourceId, ResourceStore } from '../store/resource.store';
export interface ResourceLoader {
    readonly context?: string;
    readonly loader: (key: string) => Resource | Promise<any>;
}
export interface ResourcePromise {
    readonly id: ResourceId;
    readonly promise: Promise<Resource>;
}
export interface ResourceService {
    registerResourceLoader(loader: ResourceLoader): void;
    loadResource<T = any>(id: ResourceId): Resource<T> | Promise<Resource<T>>;
}
export declare class ResourceServiceImpl implements ResourceService {
    protected _store: ResourceStore;
    protected _resourceLoaders: ResourceLoader[];
    private _resourcePromises;
    constructor(_store: ResourceStore, _resourceLoaders?: ResourceLoader[]);
    registerResourceLoader(loader: ResourceLoader): void;
    loadResource<T = any>(id: ResourceId): Resource<T> | Promise<Resource<T>>;
}
//# sourceMappingURL=resource.service.d.ts.map