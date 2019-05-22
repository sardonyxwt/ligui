import { inject, injectable } from 'inversify';
import { ScopeListener } from '@sardonyxwt/state-store';
import {
  Resources,
  ResourceScope,
  ResourceScopeAddons,
  ResourceScopeAddResourceActionProps,
  ResourceScopeState
} from '../scope/resource.scope';
import { LIGUI_TYPES } from '../types';
import autobind from 'autobind-decorator';

export type ResourceLoader = (key: string) => any | Promise<any>;

export interface ResourceService extends ResourceScopeAddons {
  loadResources(keys: string[]): Promise<Resources>;
}

@injectable()
@autobind
export class ResourceServiceImpl implements ResourceService {

  private _resourcePromises: {[key: string]: Promise<void>} = {};

  constructor(@inject(LIGUI_TYPES.RESOURCE_LOADER) private _loader: ResourceLoader,
              @inject(LIGUI_TYPES.RESOURCE_SCOPE) private _scope: ResourceScope) {}

  get resources () {
    return this._scope.resources;
  }

  getResource(key: string) {
    return this._scope.getResource(key)
  }

  setResource(props: ResourceScopeAddResourceActionProps) {
    this._scope.setResource(props)
  }

  isResourcesLoaded(keys: string[]) {
    return this._scope.isResourcesLoaded(keys)
  }

  onSetResource(listener: ScopeListener<ResourceScopeState>) {
    return this._scope.onSetResource(listener)
  }

  loadResources(keys: string[]) {
    const {_resourcePromises, _loader, _scope} = this;

    let createResourcePromise = (key: string) => {
      if (!(key in _resourcePromises)) {
        if (_scope.resources[key]) {
          _resourcePromises[key] = Promise.resolve();
        } else {
          _resourcePromises[key] = Promise.resolve(_loader(key))
            .then(resource => _scope.setResource({key, resource}));
        }
      }
      return _resourcePromises[key];
    };

    return Promise.all(keys.map(key => createResourcePromise(key)))
      .then(() => _scope.resources);
  }

}
