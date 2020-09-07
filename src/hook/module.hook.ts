import * as React from 'react';
import { ModuleId } from '@source/store/module.store';
import { ModuleContext } from '@source/context/module.context';
import { Core } from '@source/core';

/**
 * @type ModuleHook
 * @description React hook for module loading.
 * @param key {string} Module key.
 * @param context {string} Module context for loader selection.
 * @returns {T}
 * */
export type ModuleHook = <T = unknown>(key: string, context?: string) => T;

/**
 * @function createModuleHook
 * @param coreGlobalRegisterName {string} Core instance global name.
 * @returns React hook for module loading used loaders.
 */
export const createModuleHook = (
    coreGlobalRegisterName: string,
): ModuleHook => {
    return <T = unknown>(key: string, context?: string): T => {
        const core = global[coreGlobalRegisterName] as Core;

        const moduleContext = context || React.useContext(ModuleContext);

        const id: ModuleId = { key, context: moduleContext };

        const prepareModuleBody = <T>() => {
            if (core.module.store.isModuleExist(id)) {
                return core.module.store.findModuleById<T>(id).body;
            }
            const module = core.module.service.loadModule<T>(id);
            if (module instanceof Promise) {
                return;
            }
            return module.body;
        };

        const [module, setModule] = React.useState<T>(prepareModuleBody);

        React.useEffect(() => {
            if (module) {
                return;
            }
            Promise.resolve(
                core.module.service.loadModule<T>(id),
            ).then((module) => setModule(() => module.body));
        }, [module]);

        return module;
    };
};
