import { inject, injectable } from 'inversify';
import { ScopeListener } from '@sardonyxwt/state-store';
import {
  Resources,
  ResourceScope,
  ResourceScopeAddons,
  ResourceScopeAddResourceActionProps,
  ResourceScopeState
} from '@src/scope/resource.scope';
import { LiguiTypes } from '@src/types';
import { ResourceLoader } from '@src/loader/resource.loader';

export interface ResourceService extends ResourceScopeAddons {
  loadResources(keys: string[]): Promise<Resources>;
}

@injectable()
export class ResourceServiceImpl implements ResourceService {

  constructor(@inject(LiguiTypes.RESOURCE_LOADER) private loader: ResourceLoader,
              @inject(LiguiTypes.RESOURCE_SCOPE) private scope: ResourceScope) {}

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
