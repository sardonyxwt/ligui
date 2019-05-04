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
import { ResourceLoader } from '../loader/resource.loader';

export interface ResourceService extends ResourceScopeAddons {
  loadResources(keys: string[]): Promise<Resources>;
}

@injectable()
export class ResourceServiceImpl implements ResourceService {

  constructor(@inject(LIGUI_TYPES.RESOURCE_LOADER) private loader: ResourceLoader,
              @inject(LIGUI_TYPES.RESOURCE_SCOPE) private scope: ResourceScope) {}

  get resources () {
    return this.scope.resources;
  }

  getResource(key: string) {
    return this.scope.getResource(key)
  }

  setResource(props: ResourceScopeAddResourceActionProps) {
    this.scope.setResource(props)
  }

  isResourcesLoaded(keys: string[]) {
    return this.scope.isResourcesLoaded(keys)
  }

  onSetResource(listener: ScopeListener<ResourceScopeState>) {
    return this.scope.onSetResource(listener)
  }

  loadResources(keys: string[]) {
    return this.loader(keys);
  }

}
