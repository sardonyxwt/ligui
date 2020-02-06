import { observable, action } from 'mobx';
import { saveToArray } from '@sardonyxwt/utils/object';

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

export class ResourceStoreImpl implements ResourceStore {

    @observable.shallow readonly resources: Resource[] = [];

    constructor(resources: Resource[] = []) {
        this.resources.push(...resources);
    }

    @action setResource(...resources: Resource[]): void {
        resources.forEach(resource => saveToArray(
            this.resources, resource,
            existResource => isResourcesIdsEqual(resource.id, existResource.id)
        ));
    }

    findResourceById(id: ResourceId): Resource {
        return this.resources.find(resource => isResourcesIdsEqual(resource.id, id));
    }

    isResourceExist(id: ResourceId): boolean {
        return !!this.findResourceById(id);
    }

}

export function isResourcesIdsEqual(resourceId1: ResourceId, resourceId2: ResourceId) {
    return resourceId1.key === resourceId2.key
        && resourceId1.context === resourceId2.context;
}
