import { Scope, Store } from '@sardonyxwt/state-store';
import { saveToArray, copyArray } from '@sardonyxwt/utils/object';
import { LIGUI_TYPES } from '../types';

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

export interface ResourceStore extends Scope<ResourceStoreState> {
    setResources(resources: Resource[]): void;

    findResourceById<T>(id: ResourceId): Resource<T>;

    isResourceExist(id: ResourceId): boolean;
}

export enum ResourceStoreActions {
    UpdateResources = 'UPDATE_RESOURCES'
}

export const createResourceStore = (store: Store, initState: ResourceStoreState) => {
    const resourceStore = store.createScope({
        name: LIGUI_TYPES.RESOURCE_STORE,
        initState: {
            resources: initState.resources || []
        },
        isSubscribedMacroAutoCreateEnabled: true,
    }, true) as ResourceStore;

    resourceStore.registerAction(
        ResourceStoreActions.UpdateResources,
        (state, resources: Resource[]) => {
            const updatedResources = copyArray(state.resources);
            resources.forEach(resource => saveToArray(
                updatedResources, resource,
                existResource => isResourcesIdsEqual(resource.id, existResource.id)
            ));
            return {
                resources: updatedResources
            }
        }
    );

    resourceStore.findResourceById = (id: ResourceId) => {
        return resourceStore.state.resources.find(
            resource => isResourcesIdsEqual(resource.id, id)
        );
    };

    resourceStore.isResourceExist = (id: ResourceId) => {
        return !!resourceStore.findResourceById(id);
    };

    return resourceStore;
}

export function isResourcesIdsEqual(resourceId1: ResourceId, resourceId2: ResourceId) {
    return resourceId1.key === resourceId2.key
        && resourceId1.context === resourceId2.context;
}
