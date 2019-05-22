import * as React from 'react';
import { ModuleService } from '../service/module.service';
import { SynchronousPromise } from 'synchronous-promise';

export const createModuleHook = (moduleService: ModuleService) =>
  <T = any>(key: string): [T, Promise<T>] => {
    const [module, setModule] = React.useState(() => moduleService.getModule<T>(key));

    const modulePromise = React.useMemo(() => {
      if (module) {
        return SynchronousPromise.resolve(module);
      }
      return moduleService.loadModule<T>(key).then(module => {
        setModule(module);
        return module;
      });
    }, []);

    return [module, modulePromise];
  };
