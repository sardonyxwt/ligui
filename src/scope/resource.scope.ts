import { ScopeListener, ScopeMacroType, Scope, Store, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
import { copyArray, saveToArray } from '../extension/util.extension';

export const RESOURCE_SCOPE_NAME = 'resource';
export const RESOURCE_SCOPE_SET_RESOURCE_ACTION = 'setResource';

export interface ResourceIdentifier {
  readonly key: string;
  readonly context: string;
}

export interface Resource<T = any> extends ResourceIdentifier {
  readonly data: T;
}

export interface ResourceScopeState {
  readonly resources: Resource[];
}

export interface ResourceScopeAddons extends ResourceScopeState {
  setResource(resource: Resource): void;
  getResourceData(id: ResourceIdentifier): any;
  isResourceLoaded(id: ResourceIdentifier): boolean;
  onSetResource(listener: ScopeListener<ResourceScopeState>): ScopeListenerUnsubscribeCallback;
}

export interface ResourceScope extends Scope<ResourceScopeState>, ResourceScopeAddons {}

export interface ResourceScopeOptions {
  initState: ResourceScopeState;
}

export const resourceIdComparator = (id1: ResourceIdentifier) => (id2: ResourceIdentifier) =>
  id1.key === id2.key && id1.context === id2.context;

export function createResourceScope (store: Store, {initState}: ResourceScopeOptions) {
  const resourceScope = store.createScope<ResourceScopeState>({
    name: RESOURCE_SCOPE_NAME,
    initState,
    isSubscribeMacroAutoCreateEnable: true
  }) as ResourceScope;

  resourceScope.registerAction(RESOURCE_SCOPE_SET_RESOURCE_ACTION, (state, resource: Resource) => {
    const resources = copyArray(state.resources);
    saveToArray(resources, resource, resourceIdComparator(resource));

    return {resources};
  });

  resourceScope.registerMacro('resources', state => state.resources, ScopeMacroType.GETTER);
  resourceScope.registerMacro('getResourceData', (state, id: ResourceIdentifier) => {
    const resource = state.resources.find(resourceIdComparator(id));

    return !!resource ? resource.data : undefined;
  });
  resourceScope.registerMacro('isResourceLoaded', (state, id: ResourceIdentifier): boolean => {
    return !(resourceScope.getResourceData(id) === undefined);
  });

  resourceScope.lock();

  return resourceScope;
}
