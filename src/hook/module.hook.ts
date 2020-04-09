import * as React from 'react';
import { Container } from 'inversify';
import { ModuleService } from '../service/module.service';
import { LIGUI_TYPES } from '../types';
import { ModuleId, ModuleStore } from '../store/module.store';

let ModuleKeyContext: React.Context<string> = null;

if (!!React) {
    ModuleKeyContext = React.createContext<string>(undefined);
}

export { ModuleKeyContext };

export const createModuleHook = (
    container: Container
) => <T = any>(
    key: string, context?: string
): T => {
    const moduleStore = container.get<ModuleStore>(LIGUI_TYPES.MODULE_STORE);
    const moduleService = container.get<ModuleService>(LIGUI_TYPES.MODULE_SERVICE);

    const moduleContext = context || React.useContext(ModuleKeyContext);

    const id: ModuleId = {key, context: moduleContext};

    const prepareModuleBody = <T>() => {
        if (moduleStore.isModuleExist(id)) {
            return moduleStore.findModuleById<T>(id).body;
        }
        const module = moduleService.loadModule<T>(id);
        return module instanceof Promise ? null : module.body;
    };

    const [module, setModule] = React.useState<T>(prepareModuleBody);

    React.useEffect(() => {
        if (module) {
            return;
        }
        Promise.resolve(moduleService.loadModule<T>(id)).then(
            module => setModule(() => module.body)
        );
    }, [module]);

    return module;
};
