import * as React from 'react';
import { ResourceService } from '../service/resource.service';

export const createResourceHook = (
  resourceService: ResourceService
) => <T = any>(key: string): T => {
  const [resource, setResource] = React.useState<T>(() => {
    if (resourceService.isResourceLoaded(key)) {
      return resourceService.getResource(key);
    }
    resourceService.loadResources(key).then(setResource);
    return null;
  });

  return resource;
};
