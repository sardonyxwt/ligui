import * as React from 'react';
import { Container } from 'inversify';
import { ModuleService } from '../service/module.service';
import { LIGUI_TYPES } from '../types';
import { ModuleId } from '../scope/module.scope';

let ModuleKeyContext: React.Context<string> = null;

if (!!React) {
    ModuleKeyContext = React.createContext<string>(undefined);
}

export { ModuleKeyContext };

export const createModuleHook = (
    container: Container
) => <T = any>(key: string, context?: string): T => {
    const moduleService = container.get<ModuleService>(LIGUI_TYPES.MODULE_SERVICE);

    const moduleKeyContext = React.useContext(ModuleKeyContext);

    const moduleContext = context || moduleKeyContext;

    const id: ModuleId = {key, context: moduleContext};

    const [module, setModule] = React.useState<T>(() => {
        if (moduleService.isModuleLoaded(id)) {
            return moduleService.getModuleBody(id);
        }
        return null;
    });

    React.useEffect(() => {
        if (!module) {
            moduleService.loadModuleBody<T>(id).then(module => setModule(module));
        }
    }, []);

    return module;
};
