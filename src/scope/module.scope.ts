import { ScopeListener, ScopeMacroType, Scope, Store, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
import { copyArray, saveToArray } from '../extension/util.extension';

export const MODULE_SCOPE_NAME = 'module';
export const MODULE_SCOPE_SET_MODULE_ACTION = 'setModule';

export interface ModuleIdentifier {
  readonly key: string;
  readonly context: string;
}

export interface Module<T = any> extends ModuleIdentifier {
  readonly body: T;
}

export interface ModuleScopeState {
  readonly modules: Module[];
}

export interface ModuleScopeAddons extends ModuleScopeState {
  setModule(module: Module): void;
  getModuleBody<T>(id: ModuleIdentifier): T;
  isModuleLoaded(id: ModuleIdentifier): boolean;
  onSetModule(listener: ScopeListener<ModuleScopeState>): ScopeListenerUnsubscribeCallback;
}

export interface ModuleScope extends Scope<ModuleScopeState>, ModuleScopeAddons {}

export interface ModuleScopeOptions {
  initState: ModuleScopeState;
}

export const moduleIdComparator = (id1: ModuleIdentifier) => (id2: ModuleIdentifier) =>
  id1.key === id2.key && id1.context === id2.context;

export function createModuleScope (store: Store, {initState}: ModuleScopeOptions) {
  const moduleScope = store.createScope<ModuleScopeState>({
    name: MODULE_SCOPE_NAME,
    initState,
    isSubscribeMacroAutoCreateEnable: true
  }) as ModuleScope;

  moduleScope.registerAction(MODULE_SCOPE_SET_MODULE_ACTION, (state, module: Module) => {
    const modules = copyArray(state.modules);
    saveToArray(modules, module, moduleIdComparator(module));

    return {modules};
  });

  moduleScope.registerMacro('modules', state => copyArray(state.modules), ScopeMacroType.GETTER);
  moduleScope.registerMacro('getModuleBody', (state, id: ModuleIdentifier) => {
    const module = state.modules.find(moduleIdComparator(id));

    return !!module ? module.body : undefined;
  });
  moduleScope.registerMacro('isModuleLoaded', (state, id: ModuleIdentifier): boolean => {
    return !(moduleScope.getModuleBody(id) === undefined);
  });

  moduleScope.lock();

  return moduleScope;
}
