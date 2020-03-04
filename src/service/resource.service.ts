import { deleteFromArray, saveToArray } from '@sardonyxwt/utils/object';
import { isResourcesIdsEqual, Resource, ResourceId, ResourceStore } from '../store/resource.store';

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
    loadResource(id: ResourceId): Resource | Promise<Resource>;
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

    loadResource(id: ResourceId): Resource | Promise<Resource> {
        const {_resourcePromises, _resourceLoaders, _store} = this;

        if (_store.isResourceExist(id)) {
            return _store.findResourceById(id);
        }

        const resourcePromise = _resourcePromises.find(it => isResourcesIdsEqual(id, it.id));

        if (resourcePromise) {
            return resourcePromise.promise;
        }

        const resourceLoader = _resourceLoaders.find(loader => loader.context === id.context);

        if (!resourceLoader) {
            throw new Error(`Resource loader for key ${JSON.stringify(id)} not found`);
        }

        const resourceData = resourceLoader.loader(id.key);

        const resolveResource = (resourceData: any): Resource => {
            const resource: Resource = {id, data: resourceData};
            _store.setResource(resource);
            return resource;
        };

        if (resourceData instanceof Promise) {
            const newResourcePromise: ResourcePromise = {
                id, promise: resourceData.then(resolveResource)
            };

            newResourcePromise.promise.then(() => deleteFromArray(
                this._resourcePromises,
                resourcePromise => isResourcesIdsEqual(resourcePromise.id, id)
            ));

            _resourcePromises.push(newResourcePromise);
            return newResourcePromise.promise;
        }

        return resolveResource(resourceData);
    }

}
