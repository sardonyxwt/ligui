import * as React from 'react';
import { Container } from 'inversify';
import { ResourceService } from '../service/resource.service';
import { LIGUI_TYPES } from '../types';
import { ResourceIdentifier } from '../scope/resource.scope';

export const ResourceKeyContext = React.createContext<string>(null);
export const {Consumer: ResourceKeyContextConsumer, Provider: ResourceKeyContextProvider} = ResourceKeyContext;

export const createResourceHook = (
  container: Container
) => <T = any>(key: string, context?: string): T => {
  const resourceKeyContext = React.useContext(ResourceKeyContext);

  const resourceService = container.get<ResourceService>(LIGUI_TYPES.RESOURCE_SERVICE);

  const resourceContext = context || resourceKeyContext;

  if (!resourceContext) {
    throw new Error('Resource context not set you can use second parameter or ResourceKeyContextProvider');
  }

  const id: ResourceIdentifier = {key, context: resourceContext};

  const [resource, setResource] = React.useState<T>(() => {
    if (resourceService.isResourceLoaded(id)) {
      return resourceService.getResourceData(id);
    }
    resourceService.loadResource(id).then(setResource);
    return null;
  });

  return resource;
};
