export type ResourceLoader = (path: string) => Promise<any>;
export type ResourceConverter = (source: string) => Promise<any>;

export interface IResourceService {
  load(path: string, converter: string | string[]): Promise<any>;
}

export interface IResourceProviderConfig {
  loaders: {
    [key: string]: ResourceLoader
  },
  converters: {
    [key: string]: ResourceConverter
  }
}

class ResourceService implements IResourceService {

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

  createService(config: IResourceProviderConfig): IResourceService {
    return new ResourceService();
  }

}
