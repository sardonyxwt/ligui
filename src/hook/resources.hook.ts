import * as React from 'react';
import { createUniqueIdGenerator } from '@sardonyxwt/utils/generator';
import { resourceService, Resources, ResourceScopeState, ResourceScopeAddResourceActionProps, ScopeEvent, ScopeListener } from '..';

export type ResourcesHookType = (keys: string[]) => Resources;

const subscribers: {[key: string]: ScopeListener<ResourceScopeState>} = {};
const resourcesHookListenerIdGenerator = createUniqueIdGenerator('ResourcesHook');

resourceService.onSetResource(e =>
  Object.getOwnPropertyNames(subscribers).forEach(key => subscribers[key](e)));

export function ResourcesHook (keys: string[]) {
  const [resources, setResources] = React.useState<Resources>(() => {
    if (resourceService.isResourcesLoaded(keys)) {
      return resourceService.resources;
    }
    resourceService.loadResources(keys).then(setResources);
    return null;
  });

  React.useEffect(() => {
    const listenerId = resourcesHookListenerIdGenerator();
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
