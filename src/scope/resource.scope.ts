import { ScopeListener, ScopeMacroType, Scope, Store, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
import { copyArray, saveToArray } from '../extension/util.extension';

export const RESOURCE_SCOPE_NAME = 'resource';
export const RESOURCE_SCOPE_SET_RESOURCE_ACTION = 'setResource';

export interface ResourceId {
  readonly key: string;
  readonly context?: string;
}

export interface Resource<T = any> {
  readonly id: ResourceId;
  readonly data: T;
}

export interface ResourceScopeState {
  readonly resources: Resource[];
}

export interface ResourceScopeExtensions extends ResourceScopeState {
  setResource(resource: Resource): void;
  getResourceData(id: ResourceId): any;
  isResourceLoaded(id: ResourceId): boolean;
  onSetResource(listener: ScopeListener<ResourceScopeState>): ScopeListenerUnsubscribeCallback;
}

export interface ResourceScope extends Scope<ResourceScopeState>, ResourceScopeExtensions {}

export interface ResourceScopeOptions {
  initState: ResourceScopeState;
}

export const resourceIdComparator = (id1: ResourceId, id2: ResourceId) =>
  id1.key === id2.key && id1.context === id2.context;

export function createResourceScope (store: Store, {initState}: ResourceScopeOptions) {
  const resourceScope = store.createScope<ResourceScopeState>({
    name: RESOURCE_SCOPE_NAME,
    initState,
    isSubscribedMacroAutoCreateEnabled: true
  }) as ResourceScope;

  resourceScope.registerAction(RESOURCE_SCOPE_SET_RESOURCE_ACTION, (state, resource: Resource) => {
    const resources = copyArray(state.resources);
    saveToArray(resources, resource, it => resourceIdComparator(resource.id, it.id));

    return {resources};
  });

  resourceScope.registerMacro('resources', state => state.resources, ScopeMacroType.GETTER);
  resourceScope.registerMacro('getResourceData', (state, id: ResourceId) => {
    const resource = state.resources.find(it => resourceIdComparator(id, it.id));

    return !!resource ? resource.data : undefined;
  });
  resourceScope.registerMacro('isResourceLoaded', (state, id: ResourceId): boolean => {
    return resourceScope.getResourceData(id) !== undefined;
  });

  resourceScope.lock();

  return resourceScope;
}
