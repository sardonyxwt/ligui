import { resourceScope, Resources } from '..';

export type RLoader = (key: string) => any | Promise<any>;

export interface ResourceLoader {
  loader: RLoader;
  loadResources(keys: string[]): Promise<Resources>;
}

let loader: RLoader;
const resourcePromises: {[key: string]: Promise<void>} = {};

export const resourceLoader: ResourceLoader = Object.assign({
  loadResources(keys: string[]): Promise<Resources> {
    const {resources, setResource} = resourceScope;

    let createResourcePromise = (key: string) => {
      if (!(key in resourcePromises)) {
        if (resources[key]) {
          resourcePromises[key] = Promise.resolve();
        } else {
          resourcePromises[key] =
            Promise.resolve(loader(key))
              .then(null, () => loader(key))
              .then(resource => setResource({key, resource}));
        }
      }
      return resourcePromises[key];
    };

    return Promise.all(keys.map(key => createResourcePromise(key)))
      .then(() => resourceScope.resources);
  },
  set loader(newLoader: RLoader) {
    loader = newLoader;
  },
  get loader() {
    return loader;
  }
});
