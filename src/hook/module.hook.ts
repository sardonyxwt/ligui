import * as React from 'react';
import { ModuleService } from '../service/module.service';

export const createModuleHook = (
  moduleService: ModuleService
) => <T = any>(key: string): T => {
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
