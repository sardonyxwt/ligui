import { inject, injectable } from 'inversify';
import { ScopeListener } from '@sardonyxwt/state-store';
import {
  ResourceScope,
  ResourceScopeAddons,
  ResourceScopeAddResourceActionProps,
  ResourceScopeState
} from '../scope/resource.scope';
import { LIGUI_TYPES } from '../types';
import autobind from 'autobind-decorator';

export type ResourceLoader = (key: string, cb: (resource: any) => void) => void;

export interface ResourceService extends ResourceScopeAddons {
  loadResources<T>(key: string): Promise<T>;
}

@injectable()
@autobind
export class ResourceServiceImpl implements ResourceService {

  private _resourcePromises: {[key: string]: Promise<any>} = {};

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

  isResourceLoaded(key: string) {
    return this._scope.isResourceLoaded(key)
  }

  onSetResource(listener: ScopeListener<ResourceScopeState>) {
    return this._scope.onSetResource(listener)
  }

  loadResources(key: string) {
    const {_resourcePromises, _loader, _scope} = this;

    if (!(key in _resourcePromises)) {
      if (_scope.resources[key]) {
        _resourcePromises[key] = Promise.resolve(_scope.resources[key]);
      } else {
        _resourcePromises[key] = new Promise(resolve => _loader(key, resolve))
          .then(resource => _scope.setResource({key, resource}));
      }
    }
    return _resourcePromises[key];
  }

}
