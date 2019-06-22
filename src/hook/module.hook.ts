import * as React from 'react';
import { Container } from 'inversify';
import { ModuleService } from '../service/module.service';
import { LIGUI_TYPES } from '../types';
import { ModuleId } from '../scope/module.scope';

export const ModuleKeyContext = React.createContext<string>(undefined);
export const {Consumer: ModuleKeyContextConsumer, Provider: ModuleKeyContextProvider} = ModuleKeyContext;

export const createModuleHook = (
  container: Container
) => <T = any>(key: string, context?: string): T => {
  const moduleKeyContext = React.useContext(ModuleKeyContext);

  const moduleService = container.get<ModuleService>(LIGUI_TYPES.MODULE_SERVICE);

  const moduleContext = context || moduleKeyContext;

  const id: ModuleId = {key, context: moduleContext};

  const [module, setModule] = React.useState<T>(() => {
    if (moduleService.isModuleLoaded({key, context})) {
      return moduleService.getModuleBody(id);
    }
    moduleService.loadModuleBody<T>(id).then(setModule);
    return null;
  });

  return module;
};
