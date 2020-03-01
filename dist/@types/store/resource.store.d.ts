import { Repository } from '../service/repository.service';
export interface ResourceId {
    readonly key: string;
    readonly context?: string;
}
export interface Resource<T = any> {
    readonly id: ResourceId;
    readonly data: T;
}
export interface ResourceStoreState {
    readonly resources: Resource[];
}
export interface ResourceStore extends ResourceStoreState, Repository<ResourceStoreState> {
    setResource(...resources: Resource[]): void;
    findResourceById<T>(id: ResourceId): Resource<T>;
    isResourceExist(id: ResourceId): boolean;
}
export declare class ResourceStoreImpl implements ResourceStore {
    readonly resources: Resource[];
    constructor(resources?: Resource[]);
    setResource(...resources: Resource[]): void;
    findResourceById<T>(id: ResourceId): Resource<T>;
    isResourceExist(id: ResourceId): boolean;
    collect(): ResourceStoreState;
    restore(state: ResourceStoreState): void;
    reset(): void;
}
export declare function isResourcesIdsEqual(resourceId1: ResourceId, resourceId2: ResourceId): boolean;
//# sourceMappingURL=resource.store.d.ts.map