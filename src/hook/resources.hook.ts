import * as React from 'react';
import { Context } from '@src/context';
import { Resources, ResourceScopeAddResourceActionProps, ResourceScopeState } from '@src/scope/resource.scope';
import { useDependency } from '@src/hook/dependency.hook';
import { ResourceService } from '@src/service/resource.service';
import { LiguiTypes } from '@src/types';
import { ScopeEvent } from '@sardonyxwt/state-store';

export type ResourcesHookType = (context: Context, keys: string[]) => Resources;

export function useResources(context: Context, keys: string[]) {
  const resourceService = useDependency<ResourceService>(context, LiguiTypes.RESOURCE_SERVICE);

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
}
