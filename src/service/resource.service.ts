import { deleteFromArray, saveToArray } from '@source/util/object.utils';
import {
    isResourcesIdsEqual,
    Resource,
    ResourceId,
    ResourceStore,
} from '@source/store/resource.store';

/**
 * @interface ResourceLoader
 * @description Loader for resources from any context.
 */
export interface ResourceLoader {
    readonly context?: string;
    readonly bindingContext?: string;
    readonly loader?: (
        key: string,
        context: string,
    ) => unknown | Promise<unknown>;
}

interface ResourcePromise {
    readonly id: ResourceId;
    readonly promise: Promise<unknown>;
}

/**
 * @interface ResourceService
 * @description Service manage resource store.
 */
export interface ResourceService {
    /**
     * @method setResourceLoader
     * @description Add or replace exist resource loader.
     * @param loader {ResourceLoader} Loader for replaced or added.
     */
    setResourceLoader(loader: ResourceLoader): void;

    /**
     * @method getResourceLoader
     * @description Return resource loader.
     * @param context {string} Context for loader.
     * @returns {ResourceLoader}
     */
    getResourceLoader(context?: string): ResourceLoader;

    /**
     * @method loadResource
     * @description Load resource used loader.
     * @param id {ConfigId} for loader.
     * @returns {Resource<T> | Promise<Resource<T>>}
     */
    loadResource<T = unknown>(
        id: ResourceId,
    ): Resource<T> | Promise<Resource<T>>;
}

/**
 * @class ResourceServiceImpl
 * @description Default realization of ResourceService.
 * You can replace it after core instance created.
 */
export class ResourceServiceImpl implements ResourceService {
    private _resourcePromises: ResourcePromise[] = [];

    constructor(
        protected _store: ResourceStore,
        protected _resourceLoaders: ResourceLoader[] = [],
    ) {}

    setResourceLoader(loader: ResourceLoader): void {
        if (!!loader.loader === !!loader.bindingContext) {
            throw new Error('You need set loader or bindingContext');
        }
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
        const loader = this._resourceLoaders.find(
            (loader) => loader.context === context,
        );
        if (loader.bindingContext) {
            return this.getResourceLoader(loader.bindingContext);
        }
        return loader;
    }

    loadResource<T = unknown>(
        id: ResourceId,
    ): Resource<T> | Promise<Resource<T>> {
        const { _resourcePromises, _store } = this;

        if (_store.isResourceExist(id)) {
            return _store.findResourceById(id);
        }

        const resourcePromise = _resourcePromises.find((it) =>
            isResourcesIdsEqual(id, it.id),
        );

        if (resourcePromise) {
            return resourcePromise.promise as Promise<Resource<T>>;
        }

        const resourceLoader = this.getResourceLoader(id.context);

        if (!resourceLoader) {
            throw new Error(
                `Resource loader for key ${JSON.stringify(id)} not found`,
            );
        }

        const resourceData = resourceLoader.loader(id.key, id.context);

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
