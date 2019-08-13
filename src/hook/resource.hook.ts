import * as React from 'react';
import { Container } from 'inversify';
import { ResourceService } from '../service/resource.service';
import { LIGUI_TYPES } from '../types';
import { ResourceId } from '../scope/resource.scope';

let ResourceKeyContext: React.Context<string> = null;

if (!!React) {
  ResourceKeyContext = React.createContext<string>(undefined);
}

export { ResourceKeyContext };

export const createResourceHook = (
  container: Container
) => <T = any>(key: string, context?: string): T => {
  const resourceKeyContext = React.useContext(ResourceKeyContext);

  const resourceService = container.get<ResourceService>(LIGUI_TYPES.RESOURCE_SERVICE);

  const resourceContext = context || resourceKeyContext;

  const id: ResourceId = {key, context: resourceContext};

  const [resource, setResource] = React.useState<T>(() => {
    if (resourceService.isResourceLoaded(id)) {
      return resourceService.getResourceData(id);
    }
    resourceService.loadResourceData(id)
      .then(resource => setResource(resource));

    return null;
  });

  return resource;
};
