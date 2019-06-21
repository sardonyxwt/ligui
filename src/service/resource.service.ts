import {
  Resource,
  resourceIdComparator,
  ResourceId,
  ResourceScope,
  ResourceScopeAddons,
  ResourceScopeState
} from '../scope/resource.scope';
import { deleteFromArray, saveToArray } from '../extension/util.extension';
import { ScopeListener, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';

export interface ResourceLoader {
  readonly context: string;
  readonly loader: (key: string) => Promise<any>;
}

export interface ResourcePromise {
  readonly id: ResourceId;
  readonly promise: Promise<any>;
}

export interface ResourceService extends ResourceScopeAddons {
  registerResourceLoader<T>(loader: ResourceLoader);
  loadResource<T>(id: ResourceId): Promise<T>;
}

export class ResourceServiceImpl implements ResourceService {

  private _resourcePromises: ResourcePromise[] = [];

  constructor(protected _scope: ResourceScope,
              protected _resourceLoaders: ResourceLoader[] = []) {}

  get resources(): Resource[] {
    return this._scope.resources;
  }

  registerResourceLoader<T>(loader: ResourceLoader) {
    deleteFromArray(this._resourcePromises, resourcePromise => resourcePromise.id.context === loader.context);
    saveToArray(this._resourceLoaders, loader, resourceLoader => resourceLoader.context === loader.context);
  }

  setResource<T>(resource: Resource<T>): void {
    this._scope.setResource(resource);
  }

  getResourceData<T>(id: ResourceId): T {
    return this._scope.getResourceData(id);
  }

  isResourceLoaded(id: ResourceId): boolean {
    return this._scope.isResourceLoaded(id);
  }

  onSetResource(listener: ScopeListener<ResourceScopeState>): ScopeListenerUnsubscribeCallback {
    return this._scope.onSetResource(listener);
  }

  loadResource<T>(id: ResourceId): Promise<T> {
    const {_resourcePromises, _resourceLoaders, _scope} = this;
    const {setResource, getResourceData} = _scope;

    const resourcePromise = _resourcePromises.find(it => resourceIdComparator(id, it.id));

    if (resourcePromise) {
      return resourcePromise.promise;
    }

    const resourceData = getResourceData(id);

    if (resourceData) {
      const newResourcePromise: ResourcePromise = {
        id, promise: Promise.resolve(resourceData)
      };
      _resourcePromises.push(newResourcePromise);
      return newResourcePromise.promise;
    }

    const resourceLoader = _resourceLoaders.find(it => it.context === id.context);

    if (!resourceLoader) {
      throw new Error(`Resource loader for key ${JSON.stringify(id)} not found`);
    }

    const newResourcePromise: ResourcePromise = {
      id, promise: resourceLoader.loader(id.key).then(resourceData => {
        setResource({id, data: resourceData});
        return resourceData;
      })
    };

    _resourcePromises.push(newResourcePromise);

    return newResourcePromise.promise;
  }

}
