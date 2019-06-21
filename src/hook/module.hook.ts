import * as React from 'react';
import { Container } from 'inversify';
import { ModuleService } from '../service/module.service';
import { LIGUI_TYPES } from '../types';
import { ModuleIdentifier } from '../scope/module.scope';

export const ModuleKeyContext = React.createContext<string>(null);
export const {Consumer: ModuleKeyContextConsumer, Provider: ModuleKeyContextProvider} = ModuleKeyContext;

export const createModuleHook = (
  container: Container
) => <T = any>(key: string, context?: string): T => {
  const moduleKeyContext = React.useContext(ModuleKeyContext);

  const moduleService = container.get<ModuleService>(LIGUI_TYPES.MODULE_SERVICE);

  const moduleContext = context || moduleKeyContext;

  if (!moduleContext) {
    throw new Error('Module context not set you can use second parameter or ModuleKeyContextProvider');
  }

  const id: ModuleIdentifier = {key, context: moduleContext};

  const [module, setModule] = React.useState<T>(() => {
    if (moduleService.isModuleLoaded({key, context})) {
      return moduleService.getModuleBody(id);
    }
    moduleService.loadModule<T>(id).then(setModule);
    return null;
  });

  return module;
};
