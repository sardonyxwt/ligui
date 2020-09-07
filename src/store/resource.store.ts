import { Scope, Store } from '@sardonyxwt/state-store';
import { saveToArray, copyArray } from '@source/util/object.utils';
import { CoreTypes } from '@source/types';

/**
 * @interface ResourceId
 * @description ResourceId identify resource in store.
 */
export interface ResourceId {
    /**
     * @field key
     * @description Unique key in context.
     */
    readonly key: string;
    /**
     * @field context
     * @description Unique context in application.
     * Used to select loader for resource.
     */
    readonly context?: string;
}

/**
 * @interface Resource
 * @description Resource instance in store.
 */
export interface Resource<T = unknown> {
    /**
     * @field id
     * @description Unique pair of key and context.
     */
    readonly id: ResourceId;
    /**
     * @field data
     * @description Resource data.
     */
    readonly data: T;
}

/**
 * @interface ResourceStoreState
 * @description Resource store state.
 */
export interface ResourceStoreState {
    readonly resources: Resource[];
}

/**
 * @interface ResourceStore
 * @description Store for resources.
 */
export interface ResourceStore extends Scope<ResourceStoreState> {
    /**
     * @method setResources
     * @description Add or replace resources in store.
     * @param resources {Resource[]} Resources to be added or replaced.
     */
    setResources(resources: Resource[]): void;

    /**
     * @method findResourceById
     * @description Return resource with same id.
     * @param id {ResourceId} Id used to find resource in store.
     * @returns {Resource<T>}
     */
    findResourceById<T>(id: ResourceId): Resource<T>;

    /**
     * @method isResourceExist
     * @description Check is resource with same id present in store.
     * @param id {ResourceId} Id used to check resource present in store.
     * @returns {boolean}
     */
    isResourceExist(id: ResourceId): boolean;
}

export enum ResourceStoreActions {
    UpdateResources = 'UpdateResources',
}

export const createResourceStore = (
    store: Store,
    initState: ResourceStoreState,
): ResourceStore => {
    const resourceStore = store.createScope(
        {
            name: CoreTypes.ResourceStore,
            initState: {
                resources: initState.resources || [],
            },
            isSubscribedMacroAutoCreateEnabled: true,
        },
        true,
    ) as ResourceStore;

    resourceStore.registerAction(
        ResourceStoreActions.UpdateResources,
        (state, resources: Resource[]) => {
            const updatedResources = copyArray(state.resources);
            resources.forEach((resource) =>
                saveToArray(updatedResources, resource, (existResource) =>
                    isResourcesIdsEqual(resource.id, existResource.id),
                ),
            );
            return {
                resources: updatedResources,
            };
        },
    );

    resourceStore.findResourceById = <T>(id: ResourceId): Resource<T> => {
        return resourceStore.state.resources.find((resource) =>
            isResourcesIdsEqual(resource.id, id),
        ) as Resource<T>;
    };

    resourceStore.isResourceExist = (id: ResourceId) => {
        return !!resourceStore.findResourceById(id);
    };

    return resourceStore;
};

/**
 * @function isResourcesIdsEqual
 * @description Check is resources ids is equals.
 * @param resourceId1 {ResourceId} First resource id to check equals.
 * @param resourceId2 {ResourceId} Second resource id to check equals.
 * @returns {boolean}
 */
export function isResourcesIdsEqual(
    resourceId1: ResourceId,
    resourceId2: ResourceId,
): boolean {
    return (
        resourceId1.key === resourceId2.key &&
        resourceId1.context === resourceId2.context
    );
}
