import { ScopeListener, ScopeMacroType, Scope, Store, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';

export const MODULE_SCOPE_NAME = 'module';
export const MODULE_SCOPE_SET_MODULE_ACTION = 'setModule';

export interface ModuleScopeState {
  readonly modules: {[key: string]: () => any};
}

export interface ModuleScopeSetModuleActionProps {
  key: string;
  module: any;
}

export interface ModuleScopeAddons extends ModuleScopeState {
  setModule(props: ModuleScopeSetModuleActionProps): void;
  getModule(key: string): any;
  isModuleLoaded(key: string): boolean;
  onAddModule(listener: ScopeListener<ModuleScopeState>): ScopeListenerUnsubscribeCallback;
}

export interface ModuleScope extends Scope<ModuleScopeState>, ModuleScopeAddons {}

export interface ModuleScopeOptions {
  initState: ModuleScopeState;
}

export function createModuleScope (store: Store, {initState}: ModuleScopeOptions) {
  const moduleScope = store.createScope<ModuleScopeState>({
    name: MODULE_SCOPE_NAME,
    initState,
    isSubscribeMacroAutoCreateEnable: true
  }) as ModuleScope;

  moduleScope.registerAction(MODULE_SCOPE_SET_MODULE_ACTION,
    ({modules}, props: ModuleScopeSetModuleActionProps) =>
      ({modules: {...modules, [props.key]: () => props.module}}));

  moduleScope.registerMacro('modules', state => state.modules, ScopeMacroType.GETTER);
  moduleScope.registerMacro('getModule', (state, key: string) => state.modules[key] ? state.modules[key]() : undefined);
  moduleScope.registerMacro('isModuleLoaded', (state, key: string) => !!state.modules[key]);

  moduleScope.lock();

  return moduleScope;
}
