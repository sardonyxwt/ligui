import { Scope, Store } from '@sardonyxwt/state-store';
export interface ResourceId {
    readonly key: string;
    readonly context?: string;
}
export interface Resource<T = unknown> {
    readonly id: ResourceId;
    readonly data: T;
}
export interface ResourceStoreState {
    readonly resources: Resource[];
}
export interface ResourceStore extends Scope<ResourceStoreState> {
    setResources(resources: Resource[]): void;
    findResourceById<T>(id: ResourceId): Resource<T>;
    isResourceExist(id: ResourceId): boolean;
}
export declare enum ResourceStoreActions {
    UpdateResources = "UPDATE_RESOURCES"
}
export declare const createResourceStore: (store: Store, initState: ResourceStoreState) => ResourceStore;
export declare function isResourcesIdsEqual(resourceId1: ResourceId, resourceId2: ResourceId): boolean;
