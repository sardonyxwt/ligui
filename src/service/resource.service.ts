import { SynchronizedUtil, createScope, Scope } from '../';

export interface ResourceProviderState { resources: { [key: string]: any } }
export interface ResourceProviderConfig {
  loader: (path: string) => Promise<any>,
  initState?: ResourceProviderState
}
export interface ResourceService {
  set(path: string, resource: any): Promise<ResourceProviderState>;
  get(path: string, isSave?: boolean): Promise<any>;
  getScope(): Scope<ResourceProviderState>;
  configure(config: ResourceProviderConfig): void;
}

export const RESOURCES_SCOPE_NAME = 'RESOURCES_SCOPE';

class ResourceServiceImpl implements ResourceService {

  public readonly ADD_RESOURCE_ACTION = 'ADD_RESOURCE';
  private scope: Scope<ResourceProviderState>;
  private resourceCache: SynchronizedUtil.SynchronizedCache<any>;

  set(path: string, resource) {
    return this.scope.dispatch(this.ADD_RESOURCE_ACTION, {
      path, resource
    })
  }

  get(path: string, isCache?: boolean): Promise<any> {
    const resource = this.scope.getState().resources[path];
    if (resource) {
      return new Promise<any>(resolve => resolve(resource));
    }
    if (this.resourceCache.has(path)) {
      return this.resourceCache.get(path);
    } else {
      const promise = this.resourceCache.get(path);
      promise.then(resource => {
        this.resourceCache.remove(path);
        if (isCache) {
          this.scope.dispatch(this.ADD_RESOURCE_ACTION, {
            path, resource
          })
        }
      });
      return promise
    }
  }

  getScope() {
    return this.scope;
  }

  configure(config: ResourceProviderConfig) {
    if (this.scope) {
      throw new Error('ResourceService must configure only once.');
    }
    this.scope = createScope<ResourceProviderState>(
      RESOURCES_SCOPE_NAME,
      config.initState || {resources: {}}
    );
    this.scope.registerAction(
      this.ADD_RESOURCE_ACTION,
      (scope, props, resolve) => {
        resolve(Object.assign(scope, {[props.path]: props.resource}))
      });
    this.scope.freeze();
    this.resourceCache = SynchronizedUtil.createSyncCache<any>(config.loader);
  }

}

export const resourceService: ResourceService = new ResourceServiceImpl();
