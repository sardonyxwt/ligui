import * as React from 'react';
import { Container } from 'inversify';
import { ResourceService } from '../service/resource.service';
import { LIGUI_TYPES } from '../types';

export const createResourceHook = (
  container: Container
) => <T = any>(key: string): T => {
  const resourceService = container.get<ResourceService>(LIGUI_TYPES.RESOURCE_SERVICE);

  const [resource, setResource] = React.useState<T>(() => {
    if (resourceService.isResourceLoaded(key)) {
      return resourceService.getResource(key);
    }
    resourceService.loadResources(key).then(setResource);
    return null;
  });

  return resource;
};
