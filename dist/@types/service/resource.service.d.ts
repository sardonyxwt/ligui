import { Resource, ResourceId, ResourceStore } from '../store/resource.store';
export interface ResourceLoader {
    readonly context?: string;
    readonly loader: (key: string) => Promise<any>;
}
export interface ResourcePromise {
    readonly id: ResourceId;
    readonly promise: Promise<Resource>;
}
export interface ResourceService {
    registerResourceLoader(loader: ResourceLoader): void;
    loadResource(id: ResourceId): Promise<Resource>;
}
export declare class ResourceServiceImpl implements ResourceService {
    protected _store: ResourceStore;
    protected _resourceLoaders: ResourceLoader[];
    private _resourcePromises;
    constructor(_store: ResourceStore, _resourceLoaders?: ResourceLoader[]);
    registerResourceLoader(loader: ResourceLoader): void;
    loadResource(id: ResourceId): Promise<Resource>;
}
//# sourceMappingURL=resource.service.d.ts.map