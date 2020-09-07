import * as React from 'react';
import { ResourceId } from '@source/store/resource.store';
import { ModuleContext } from '@source/context/module.context';
import { Core } from '@source/core';

/**
 * @type ResourceHook
 * @description React hook for resource loading.
 * @param key {string} Resource key.
 * @param context {string} Resource context for loader selection.
 * @returns {T}
 * */
export type ResourceHook = <T = unknown>(key: string, context?: string) => T;

/**
 * @function createResourceHook
 * @param coreGlobalRegisterName {string} Core instance global name.
 * @returns React hook for resource loading used loaders.
 */
export const createResourceHook = (
    coreGlobalRegisterName: string,
): ResourceHook => {
    return <T = unknown>(key: string, context?: string): T => {
        const core = global[coreGlobalRegisterName] as Core;

        const resourceContext = context || React.useContext(ModuleContext);

        const id: ResourceId = { key, context: resourceContext };

        const prepareResourceData = <T>() => {
            if (core.resource.store.isResourceExist(id)) {
                return core.resource.store.findResourceById<T>(id).data;
            }
            const resource = core.resource.service.loadResource<T>(id);
            if (resource instanceof Promise) {
                return;
            }
            return resource.data;
        };

        const [resource, setResource] = React.useState<T>(prepareResourceData);

        React.useEffect(() => {
            if (resource) {
                return;
            }
            Promise.resolve(
                core.resource.service.loadResource<T>(id),
            ).then((resource) => setResource(() => resource.data));
        }, [resource]);

        return resource;
    };
};
