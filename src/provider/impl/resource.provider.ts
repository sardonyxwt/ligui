import { createScope, Scope } from '@sardonyxwt/state-store';
import { createSyncCache, SynchronizedCache } from '@sardonyxwt/utils/synchronized';
import { Provider } from '../provider';

export type ResourceLoader = (path: string) => Promise<any>;
export interface AddResourceActionProps { path: string, resource: any }

export interface IResourceService {
  load(path: string, isSave?: boolean): Promise<any>;
}

export interface IResourceProviderState {
  resources: { [key: string]: any }
}

export interface IResourceProviderConfig {
  loader: ResourceLoader,
  initState?: IResourceProviderState
}

class ResourceService implements IResourceService {

  static readonly SCOPE_NAME = 'RESOURCES_SCOPE';
  static readonly ADD_RESOURCE_ACTION = 'ADD_RESOURCE';

  readonly scope: Scope;
  private resourceCache: SynchronizedCache<any>;

  constructor(private config: IResourceProviderConfig) {
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


}

export class ResourceProvider extends Provider<IResourceService, IResourceProviderConfig> {

  private static instance: ResourceProvider;

  private constructor() {
    super();
  }

  static get INSTANCE() {
    return this.instance || (this.instance = new ResourceProvider());
  }

  protected createService(config: IResourceProviderConfig): IResourceService {
    return new ResourceService(config);
  }

}
