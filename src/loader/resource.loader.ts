import { Resources, ResourceScope } from '../scope/resource.scope';

export type ResourcePartLoader = (key: string) => any | Promise<any>;
export type ResourceLoader = (keys: string[]) => Promise<Resources>;

export function createResourceLoader(
  resourceScope: ResourceScope,
  loader: ResourcePartLoader
): ResourceLoader {
  const resourcePromises: {[key: string]: Promise<void>} = {};

  return (keys: string[]) => {
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
  }
}
