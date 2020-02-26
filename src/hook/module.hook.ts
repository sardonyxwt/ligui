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
) => <T = any>(key: string, context?: string): T => {
    const moduleStore = container.get<ModuleStore>(LIGUI_TYPES.MODULE_STORE);
    const moduleService = container.get<ModuleService>(LIGUI_TYPES.MODULE_SERVICE);

    const moduleKeyContext = React.useContext(ModuleKeyContext);

    const moduleContext = context || moduleKeyContext;

    const id: ModuleId = {key, context: moduleContext};

    const prepareModuleBody = <T>() => {
        if (moduleStore.isModuleExist(id)) {
            return moduleStore.findModuleById<T>(id).body;
        }
        return null;
    };

    const [module, setModule] = React.useState<T>(prepareModuleBody);

    React.useEffect(() => {
        if (!module) {
            moduleService.loadModule(id).then(() => setModule(prepareModuleBody));
        }
    }, []);

    return module;
};
