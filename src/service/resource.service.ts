import { createScope, Scope } from '@sardonyxwt/state-store';
import { createSyncCache, SynchronizedCache } from '@sardonyxwt/utils/synchronized';

export interface ResourceProviderState { resources: { [key: string]: any } }
export interface ResourceProviderConfig {
  loader: (path: string) => Promise<any>,
  initState?: ResourceProviderState
}

export class ResourceService {

  public static readonly SCOPE_NAME = 'RESOURCES_SCOPE';
  public static readonly ADD_RESOURCE_ACTION = 'ADD_RESOURCE';
  private scope: Scope<ResourceProviderState>;
  private resourceCache: SynchronizedCache<any>;
  private static instance: ResourceService;

  private constructor() {
  }

  static get INSTANCE() {
    return this.instance || (this.instance = new ResourceService());
  }

  set(path: string, resource) {
    return this.scope.dispatch(ResourceService.ADD_RESOURCE_ACTION, {
      path, resource
    })
  }

  get(path: string, isSave?: boolean): Promise<any> {
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
        if (isSave) {
          this.scope.dispatch(ResourceService.ADD_RESOURCE_ACTION, {
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
      ResourceService.SCOPE_NAME,
      config.initState || {resources: {}}
    );
    this.scope.registerAction(
      ResourceService.ADD_RESOURCE_ACTION,
      (scope, props, resolve) => {
        resolve(Object.assign(scope, {[props.path]: props.resource}))
      });
    this.scope.freeze();
    this.resourceCache = createSyncCache<any>(config.loader);
  }

}
