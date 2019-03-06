import { resourceScope, resourceLoader, ResourceLoader, RLoader, ResourceScopeAddons } from '..';

export interface ResourceService extends ResourceScopeAddons, ResourceLoader {}

export function createResourceServiceInstance(): ResourceService {
  return Object.freeze({
    configure: resourceScope.configure.bind(resourceScope),
    getResource: resourceScope.getResource.bind(resourceScope),
    isResourcesLoaded: resourceScope.isResourcesLoaded.bind(resourceScope),
    onConfigure: resourceScope.onConfigure.bind(resourceScope),
    onSetResource: resourceScope.onSetResource.bind(resourceScope),
    setResource: resourceScope.setResource.bind(resourceScope),
    unsubscribe: resourceScope.unsubscribe.bind(resourceScope),
    loadResources: resourceLoader.loadResources.bind(resourceLoader),
    get resources() {
      return resourceScope.resources;
    },
    get isConfigured() {
      return resourceScope.isConfigured;
    },
    get loader() {
      return resourceLoader.loader;
    },
    set loader(loader: RLoader) {
      resourceLoader.loader = loader;
    }
  });
}
