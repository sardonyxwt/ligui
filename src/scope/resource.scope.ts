import { createSyncScope, ScopeEvent, ScopeMacroType, SyncScope } from '@sardonyxwt/state-store';

export const RESOURCE_SCOPE_NAME = 'resource';
export const RESOURCE_SCOPE_CONFIGURE_ACTION = 'configure';
export const RESOURCE_SCOPE_SET_RESOURCE_ACTION = 'setResource';

export interface Resources {
  [key: string]: any;
}

export interface ResourceScopeState {
  resources: Resources
}

export interface ResourceScopeConfigureActionProps extends ResourceScopeState {}
export interface ResourceScopeAddResourceActionProps {
  key: string;
  resource: any;
}

export interface ResourceScopeAddons {
  readonly resources: Resources;
  readonly isConfigured: boolean;
  configure(props: ResourceScopeState): void;
  setResource(props: ResourceScopeAddResourceActionProps): void;
  getResource(key: string): any;
  isResourcesLoaded(keys: string[]): boolean;
  onConfigure(e: ScopeEvent<ResourceScopeState>);
  onSetResource(e: ScopeEvent<ResourceScopeState>);
}

export interface ResourceScope extends SyncScope<ResourceScopeState>, ResourceScopeAddons {}

export const resourceScope = createSyncScope<ResourceScopeState>({
  name: RESOURCE_SCOPE_NAME,
  initState: null,
  isSubscribeMacroAutoCreateEnable: true
}) as ResourceScope;

resourceScope.registerAction(RESOURCE_SCOPE_CONFIGURE_ACTION, ((state, {
  resources
}: ResourceScopeConfigureActionProps) => {
  if (state) {
    throw new Error('Configure action can be call only once.');
  }
  return {resources};
}));

resourceScope.registerAction(RESOURCE_SCOPE_SET_RESOURCE_ACTION, ({resources}, {
  key, resource
}: ResourceScopeAddResourceActionProps) => {
  return {resources: {...resources, [key]: resource}};
});

resourceScope.registerMacro('resources', state => state.resources, ScopeMacroType.GETTER);
resourceScope.registerMacro('getResource', (state, key: string) => state.resources[key], ScopeMacroType.FUNCTION);
resourceScope.registerMacro('isResourcesLoaded', ({resources}, keys: string[]) => {
  keys.forEach(key => {
    if (!resources[key]) {
      return false;
    }
  });

  return true;
});
resourceScope.registerMacro('isConfigured', state => !!state, ScopeMacroType.GETTER);

resourceScope.lock();
