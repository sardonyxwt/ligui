import { deleteFromArray, saveToArray } from '@sardonyxwt/utils/object';
import { isResourcesIdsEqual, Resource, ResourceId, ResourceStore } from '../store/resource.store';

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

export class ResourceServiceImpl implements ResourceService {

    private _resourcePromises: ResourcePromise[] = [];

    constructor(protected _store: ResourceStore,
                protected _resourceLoaders: ResourceLoader[] = []) {
    }

    registerResourceLoader(loader: ResourceLoader) {
        deleteFromArray(this._resourcePromises, resourcePromise => resourcePromise.id.context === loader.context);
        saveToArray(this._resourceLoaders, loader, resourceLoader => resourceLoader.context === loader.context);
    }

    loadResource(id: ResourceId): Promise<Resource> {
        const {_resourcePromises, _resourceLoaders, _store} = this;

        const resourcePromise = _resourcePromises.find(it => isResourcesIdsEqual(id, it.id));

        if (resourcePromise) {
            return resourcePromise.promise;
        }

        if (_store.isResourceExist(id)) {
            const newResourcePromise: ResourcePromise = {
                id, promise: Promise.resolve(_store.findResourceById(id))
            };
            _resourcePromises.push(newResourcePromise);
            return newResourcePromise.promise;
        }

        const resourceLoader = _resourceLoaders.find(loader => loader.context === id.context);

        if (!resourceLoader) {
            throw new Error(`ResourceData loader for key ${JSON.stringify(id)} not found`);
        }

        const newResourcePromise: ResourcePromise = {
            id, promise: resourceLoader.loader(id.key).then(resourceData => {
                const resource: Resource = {id, data: resourceData};
                _store.setResource(resource);
                return resource;
            })
        };

        _resourcePromises.push(newResourcePromise);

        return newResourcePromise.promise;
    }

}
