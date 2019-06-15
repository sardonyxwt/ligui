import { ScopeListener, ScopeMacroType, Scope, Store, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';

export const RESOURCE_SCOPE_NAME = 'resource';
export const RESOURCE_SCOPE_SET_RESOURCE_ACTION = 'setResource';

export interface Resources {
  [key: string]: any;
}

export interface ResourceScopeState {
  readonly resources: Resources
}

export interface ResourceScopeSetResourceActionProps {
  key: string;
  resource: any;
}

export interface ResourceScopeAddons extends ResourceScopeState {
  setResource(props: ResourceScopeSetResourceActionProps): void;
  getResource(key: string): any;
  isResourceLoaded(key: string): boolean;
  onSetResource(listener: ScopeListener<ResourceScopeState>): ScopeListenerUnsubscribeCallback;
}

export interface ResourceScope extends Scope<ResourceScopeState>, ResourceScopeAddons {}

export interface ResourceScopeOptions {
  initState: ResourceScopeState;
}

export function createResourceScope (store: Store, {initState}: ResourceScopeOptions) {
  const resourceScope = store.createScope<ResourceScopeState>({
    name: RESOURCE_SCOPE_NAME,
    initState,
    isSubscribeMacroAutoCreateEnable: true
  }) as ResourceScope;

  resourceScope.registerAction(RESOURCE_SCOPE_SET_RESOURCE_ACTION, ({resources}, {
    key, resource
  }: ResourceScopeSetResourceActionProps) => ({resources: {...resources, [key]: resource}}));

  resourceScope.registerMacro('resources', state => state.resources, ScopeMacroType.GETTER);
  resourceScope.registerMacro('getResource', (state, key: string) => state.resources[key]);
  resourceScope.registerMacro('isResourceLoaded', (state, key: string) => !!state.resources[key]);

  resourceScope.lock();

  return resourceScope;
}
