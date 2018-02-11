import { createScope, Scope } from '@sardonyxwt/state-store';
import { createSyncCache, SynchronizedCache } from '@sardonyxwt/utils/synchronized';

export type ResourceLoader = (path: string) => Promise<any>;
export interface AddResourceActionProps { path: string, resource: any }

export interface IResourceProviderState {
  resources: { [key: string]: any }
}

export interface IResourceProviderConfig {
  loader: ResourceLoader,
  initState?: IResourceProviderState
}

export class ResourceService {

  public static readonly SCOPE_NAME = 'RESOURCES_SCOPE';
  public static readonly ADD_RESOURCE_ACTION = 'ADD_RESOURCE';
  private scope: Scope<IResourceProviderState>;
  private isConfigured: boolean;
  private resourceCache: SynchronizedCache<any>;
  private static instance: ResourceService;

  private constructor() {
  }

  static get INSTANCE() {
    return this.instance || (this.instance = new ResourceService());
  }

  load(path: string, isSave?: boolean): Promise<any> {
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

  configure(config: IResourceProviderConfig) {
    if (this.isConfigured) {
      throw new Error('ResourceService must configure only once.');
    } else this.isConfigured = true;
    this.scope = createScope<IResourceProviderState>(
      ResourceService.SCOPE_NAME,
      config.initState || {
        resources: {}
      }
    );
    this.scope.registerAction(
      ResourceService.ADD_RESOURCE_ACTION,
      (scope, props: AddResourceActionProps, resolve) => {
        resolve({
          ...scope,
          [props.path]: props.resource
        })
      });
    this.scope.freeze();
    this.resourceCache = createSyncCache<any>(config.loader);
  }

}
