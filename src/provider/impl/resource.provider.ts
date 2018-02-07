import { createScope, Scope } from '@sardonyxwt/state-store';
import { Provider } from '../provider';

export type ResourceLoader = (path: string) => Promise<any>;
export type ResourceConverter = (source: string) => Promise<any>;

export interface IResourceService {
  load(path: string, converter: string | string[]): Promise<any>;
}

export interface IResourceProviderState {
  resources: { [key: string]: any }
}

export interface IResourceProviderConfig {
  loaders: {
    [key: string]: ResourceLoader
  },
  converters: {
    [key: string]: ResourceConverter
  },
  initState: IResourceProviderState
}

class ResourceService implements IResourceService {

  private scope: Scope;

  constructor(private config: IResourceProviderConfig) {
    this.scope = createScope<IResourceProviderState>(
      'RESOURCES_SCOPE',
      config.initState
    );
    this.scope.freeze();
  }

  load(path: string, converter: string | string[]): Promise<any> {
    return undefined;
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
