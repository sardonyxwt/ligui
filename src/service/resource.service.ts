import { resourceScope, ResourceScopeAddons } from '../scope/resource.scope';
import { resourceLoader, ResourceLoader, RLoader } from '../loader/resource.loader';

export interface ResourceService extends ResourceScopeAddons, ResourceLoader {}

class ResourceServiceImpl implements ResourceService {

  configure = resourceScope.configure;
  getResource = resourceScope.getResource;
  isResourcesLoaded = resourceScope.isResourcesLoaded;
  onConfigure = resourceScope.onConfigure;
  onSetResource = resourceScope.onSetResource;
  setResource = resourceScope.setResource;
  loadResources = resourceLoader.loadResources;

  get resources() {
    return resourceScope.resources;
  }

  get isConfigured() {
    return resourceScope.isConfigured;
  }

  get loader() {
    return resourceLoader.loader;
  }

  set loader(loader: RLoader) {
    resourceLoader.loader = loader;
  }

}

export const resourceService = new ResourceServiceImpl() as ResourceService;
