import * as React from 'react';
import { uniqueId } from '@sardonyxwt/utils/generator';
import { resourceService, Resources, ResourceScopeState, ResourceScopeAddResourceActionProps, ScopeEvent, ScopeListener } from '..';

const subscribers: {[key: string]: ScopeListener<ResourceScopeState>} = {};

resourceService.onSetResource(e =>
  Object.getOwnPropertyNames(subscribers).forEach(key => subscribers[key](e)));

export function useResources(keys: string[]) {
  let firstLoadComplete = false;
  const listenerId = uniqueId('UseResourcesHook');
  const [resources, setResources] = React.useState<Resources>(null);

  const setup = () => resourceService.loadResources(keys).then(setResources);

  if (resourceService.isResourcesLoaded(keys)) {
    setResources(resourceService.resources);
    firstLoadComplete = true;
  } else {
    setup().then(() => firstLoadComplete = true);
  }

  React.useEffect(() => {
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
