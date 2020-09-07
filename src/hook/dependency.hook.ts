import * as React from 'react';
import { Core } from '@source/core';
import { ModuleId } from '@source/store/module.store';

/**
 * @type DependencyHook
 * @description React hook for dependency injection.
 * @param id {string} Dependency id of dependency.
 * @param sync {boolean} Check if dependency resolved return it or wait when resolved.
 * @returns {T}
 * */
export type DependencyHook = <T>(id: string, sync?: boolean) => T;

/**
 * @function createDependencyHook
 * @param coreGlobalRegisterName {string} Core instance global name.
 * @returns React hook to manage dependencies.
 */
export const createDependencyHook = (
    coreGlobalRegisterName: string,
): DependencyHook => {
    return <T>(id: string, sync?: boolean): T => {
        const core = global[coreGlobalRegisterName] as Core;

        const [dependency, setDependency] = React.useState<T>(() => {
            const dependency = core.container[id];
            if (sync && dependency instanceof Promise) {
                return;
            }
            return dependency;
        });

        React.useEffect(() => {
            const dependency = core.container[id];
            if (sync && dependency instanceof Promise) {
                Promise.resolve(dependency).then((dependency) =>
                    setDependency(dependency),
                );
            } else {
                setDependency(dependency);
            }
        }, [id]);

        return dependency;
    };
};

/**
 * @type ModuleDependencyHook
 * @description React hook for dependency injection.
 * @param moduleId {string} Module id when dependency exist.
 * @param dependencyId {string | ((module) => string)} Dependency id of dependency or id resolver.
 * @param sync {boolean} Check if dependency resolved return it or wait when resolved.
 * @returns {T}
 * */
export type ModuleDependencyHook = <T>(
    moduleId: string | ModuleId,
    dependencyId: string | ((module) => string),
    sync?: boolean,
) => T;

/**
 * @function createModuleDependencyHook
 * @param coreGlobalRegisterName {string} Core instance global name.
 * @returns React hook to manage dependencies with module binding.
 */
export const createModuleDependencyHook = (
    coreGlobalRegisterName: string,
): ModuleDependencyHook => {
    return <T>(
        moduleId: string | ModuleId,
        dependencyId: string | ((module) => string),
        sync?: boolean,
    ): T => {
        const core = global[coreGlobalRegisterName] as Core;

        const module = core.useModule(
            typeof moduleId === 'string' ? moduleId : moduleId.key,
            typeof moduleId === 'object' ? moduleId.context : undefined,
        );

        const resolveDependencyId = () => {
            if (!module) {
                return;
            }
            if (typeof dependencyId === 'string') {
                return dependencyId;
            }
            return dependencyId(module);
        };

        return core.useDependency(resolveDependencyId(), sync);
    };
};
