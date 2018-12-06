import * as React from 'react';
import { uniqueId } from '@sardonyxwt/utils/generator';
import { resourceService, Resources, ResourceScopeState, ResourceScopeAddResourceActionProps, ScopeEvent, ScopeListener } from '..';

const subscribers: {[key: string]: ScopeListener<ResourceScopeState>} = {};

resourceService.onSetResource(e =>
  Object.getOwnPropertyNames(subscribers).forEach(key => subscribers[key](e)));

export function useResources(keys: string[]) {
  const [resources, setResources] = React.useState<Resources>(() => {
    if (resourceService.isResourcesLoaded(keys)) {
      return resourceService.resources;
    }
    resourceService.loadResources(keys).then(setResources);
    return null;
  });

  React.useEffect(() => {
    const listenerId = uniqueId('LigResourcesHook');
    subscribers[listenerId] = (e: ScopeEvent<ResourceScopeState>) => {
      const {key} = e.props as ResourceScopeAddResourceActionProps;
      if (!!keys.find(it => it === key)) {
        setResources(resourceService.resources);
      }
    };
    return () => delete subscribers[listenerId];
  });

  return resources;
}