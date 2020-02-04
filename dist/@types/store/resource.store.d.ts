export interface ResourceId {
    readonly key: string;
    readonly context?: string;
}
export interface Resource<T = any> {
    readonly id: ResourceId;
    readonly data: T;
}
export interface ResourceStore {
    readonly resources: Resource[];
    setResource(...resources: Resource[]): void;
    findResourceById(id: ResourceId): Resource;
    isResourceExist(id: ResourceId): boolean;
}
export declare class ResourceStoreImpl implements ResourceStore {
    readonly resources: Resource[];
    constructor(resources?: Resource[]);
    setResource(...resources: Resource[]): void;
    findResourceById(id: ResourceId): Resource;
    isResourceExist(id: ResourceId): boolean;
}
export declare function isResourcesIdsEqual(resourceId1: ResourceId, resourceId2: ResourceId): boolean;
//# sourceMappingURL=resource.store.d.ts.map