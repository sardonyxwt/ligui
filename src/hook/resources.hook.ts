import * as React from 'react';
import { Resources, ResourceScopeAddResourceActionProps, ResourceScopeState } from '../scope/resource.scope';
import { ResourceService } from '../service/resource.service';
import { ScopeEvent } from '@sardonyxwt/state-store';

export const createResourceHook = (resourceService: ResourceService) =>
  (keys: string[]): Resources => {
    const [resources, setResources] = React.useState<Resources>(() => {
      if (resourceService.isResourcesLoaded(keys)) {
        return resourceService.resources;
      }
      resourceService.loadResources(keys).then(setResources);
      return null;
    });

    React.useEffect(() => resourceService.onSetResource(
      (e: ScopeEvent<ResourceScopeState>) => {
        const {key} = e.props as ResourceScopeAddResourceActionProps;
        if (!!keys.find(it => it === key)) {
          setResources(resourceService.resources);
        }
      })
    );

    return resources;
  };
