import { observable, action } from 'mobx';
import { saveToArray } from '@sardonyxwt/utils/object';
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

export interface ResourceStore extends ResourceStoreState {
    setResource(...resources: Resource[]): void;

    findResourceById<T>(id: ResourceId): Resource<T>;

    isResourceExist(id: ResourceId): boolean;
}

export class ResourceStoreImpl implements ResourceStore, Repository<ResourceStoreState> {

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

    findResourceById<T>(id: ResourceId): Resource<T> {
        return this.resources.find(resource => isResourcesIdsEqual(resource.id, id));
    }

    isResourceExist(id: ResourceId): boolean {
        return !!this.findResourceById(id);
    }

    collect(): ResourceStoreState {
        return {
            resources: this.resources
        };
    }

    restore(state: ResourceStoreState): void {
        this.resources.splice(0, this.resources.length);
        this.resources.push(...state.resources);
    }

    reset(): void {
        this.resources.splice(0, this.resources.length);
    }

}

export function isResourcesIdsEqual(resourceId1: ResourceId, resourceId2: ResourceId) {
    return resourceId1.key === resourceId2.key
        && resourceId1.context === resourceId2.context;
}
