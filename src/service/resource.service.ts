import { deleteFromArray, saveToArray } from '@sardonyxwt/utils';
import {
    isResourcesIdsEqual,
    Resource,
    ResourceId,
    ResourceStore,
} from '../store/resource.store';

export interface ResourceLoader {
    readonly context?: string;
    readonly loader: (key: string) => unknown | Promise<unknown>;
}

export interface ResourcePromise {
    readonly id: ResourceId;
    readonly promise: Promise<unknown>;
}

export interface ResourceService {
    setResourceLoader(loader: ResourceLoader): void;
    getResourceLoader(context?: string): ResourceLoader;

    loadResource<T = unknown>(
        id: ResourceId,
    ): Resource<T> | Promise<Resource<T>>;
}

export class ResourceServiceImpl implements ResourceService {
    private _resourcePromises: ResourcePromise[] = [];

    constructor(
        protected _store: ResourceStore,
        protected _resourceLoaders: ResourceLoader[] = [],
    ) {}

    setResourceLoader(loader: ResourceLoader): void {
        deleteFromArray(
            this._resourcePromises,
            (resourcePromise) => resourcePromise.id.context === loader.context,
        );
        saveToArray(
            this._resourceLoaders,
            loader,
            (resourceLoader) => resourceLoader.context === loader.context,
        );
    }

    getResourceLoader(context?: string): ResourceLoader {
        return this._resourceLoaders.find(
            (loader) => loader.context === context,
        );
    }

    loadResource<T = unknown>(
        id: ResourceId,
    ): Resource<T> | Promise<Resource<T>> {
        const { _resourcePromises, _resourceLoaders, _store } = this;

        if (_store.isResourceExist(id)) {
            return _store.findResourceById(id);
        }

        const resourcePromise = _resourcePromises.find((it) =>
            isResourcesIdsEqual(id, it.id),
        );

        if (resourcePromise) {
            return resourcePromise.promise as Promise<Resource<T>>;
        }

        const resourceLoader = _resourceLoaders.find(
            (loader) => loader.context === id.context,
        );

        if (!resourceLoader) {
            throw new Error(
                `Resource loader for key ${JSON.stringify(id)} not found`,
            );
        }

        const resourceData = resourceLoader.loader(id.key);

        const resolveResource = (resourceData: unknown): Resource => {
            const resource: Resource = { id, data: resourceData };
            _store.setResources([resource]);
            return resource;
        };

        if (resourceData instanceof Promise) {
            const newResourcePromise: ResourcePromise = {
                id,
                promise: resourceData.then(resolveResource),
            };

            newResourcePromise.promise.then(() =>
                deleteFromArray(this._resourcePromises, (resourcePromise) =>
                    isResourcesIdsEqual(resourcePromise.id, id),
                ),
            );

            _resourcePromises.push(newResourcePromise);
            return newResourcePromise.promise as Promise<Resource<T>>;
        }

        return resolveResource(resourceData) as Resource<T>;
    }
}
