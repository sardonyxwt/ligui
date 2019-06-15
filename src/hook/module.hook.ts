import * as React from 'react';
import { Container } from 'inversify';
import { ModuleService } from '../service/module.service';
import { LIGUI_TYPES } from '../types';

export const createModuleHook = (
  container: Container
) => <T = any>(key: string): T => {
  const moduleService = container.get<ModuleService>(LIGUI_TYPES.MODULE_SERVICE);

  const [module, setModule] = React.useState<T>(() => {
    const isModuleLoaded = moduleService.isModuleLoaded(key);
    if (isModuleLoaded) {
      return moduleService.getModule(key);
    }
    moduleService.loadModule<T>(key).then(setModule);
    return null;
  });

  return module;
};
