import { resourceScope, Resources } from '..';

export type RLoader = (key: string) => any | Promise<any>;

export interface ResourceLoader {
  loader: RLoader;
  loadResources(keys: string[]): Promise<Resources>;
}

class ResourceLoaderImpl implements ResourceLoader {

  private _loader: RLoader;
  private readonly _resourcePromises: {[key: string]: Promise<void>} = {};

  loadResources(keys: string[], isCache?: boolean): Promise<Resources> {
    const {_loader, _resourcePromises} = this;
    const {resources, setResource} = resourceScope;

    let createResourcePromise = (key: string) => {
      if (!(key in _resourcePromises)) {
        if (resources[key]) {
          _resourcePromises[key] = Promise.resolve();
        } else {
          _resourcePromises[key] =
            Promise.resolve(_loader(key))
              .then(null, () => _loader(key))
              .then(resource => setResource({key, resource}));
        }
      }
      return _resourcePromises[key];
    };

    return Promise.all(keys.map(key => createResourcePromise(key)))
      .then(() => resourceScope.resources);
  }

  set loader(loader: RLoader) {
    this._loader = loader;
  }

  get loader() {
    return this._loader;
  }

}

export const resourceLoader: ResourceLoader = new ResourceLoaderImpl();
