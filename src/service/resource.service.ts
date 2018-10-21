import * as SynchronizedUtil from '@sardonyxwt/utils/synchronized';
import {createSyncScope, SyncScope} from '@sardonyxwt/state-store';

export interface ResourceServiceState {
  resources: { [key: string]: any }
}

export interface ResourceServiceConfig {
  loader: (path: string) => Promise<any>,
  initState?: ResourceServiceState
}

export interface ResourceService {
  set(path: string, resource: any): void;
  get(path: string, isSave?: boolean): Promise<any>;
  getScope(): SyncScope<ResourceServiceState>;
  configure(config: ResourceServiceConfig): void;
}

export const RESOURCES_SCOPE_NAME = 'RESOURCES_SCOPE';
export const RESOURCES_SCOPE_ACTION_ADD = 'ADD_RESOURCE';

class ResourceServiceImpl implements ResourceService {

  private scope: SyncScope<ResourceServiceState>;
  private resourceCache: SynchronizedUtil.SynchronizedCache<any>;

  set(path: string, resource) {
    return this.scope.dispatch(RESOURCES_SCOPE_ACTION_ADD, {
      path, resource
    })
  }

  get(path: string, isCache?: boolean): Promise<any> {
    const resource = this.scope.state.resources[path];
    if (resource) {
      return Promise.resolve(resource);
    }
    return this.resourceCache.get(path).then(resource => {
      this.resourceCache.remove(path);
      if (isCache) {
        this.scope.dispatch(RESOURCES_SCOPE_ACTION_ADD, {
          path, resource
        })
      }
      return resource;
    });
  }

  getScope() {
    return this.scope;
  }

  configure(config: ResourceServiceConfig) {
    if (this.scope) {
      throw new Error('ResourceService must configure only once.');
    }
    this.scope = createSyncScope<ResourceServiceState>(
      RESOURCES_SCOPE_NAME,
      config.initState || {resources: {}}
    );
    this.scope.registerAction(
      RESOURCES_SCOPE_ACTION_ADD,
      (scope, {path, resource}) => Object.assign(scope, {[path]: resource}));
    this.scope.lock();
    this.resourceCache = SynchronizedUtil.createSyncCache<any>(config.loader);
  }

}

export const resourceService: ResourceService = new ResourceServiceImpl();
