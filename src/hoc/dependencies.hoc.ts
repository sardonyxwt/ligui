import * as React from 'react';
import { ModuleId } from '@source/store/module.store';
import { ConfigId } from '@source/store/config.store';
import { ResourceId } from '@source/store/resource.store';
import { TranslateUnitId } from '@source/store/internationalization.store';
import { Translator } from '@source/service/internationalization.service';
import { Core } from '@source';

export type DependencyId = {
    moduleId: string | ModuleId;
    key: string | ((module) => string);
};

export type DependenciesHocOptions = {
    dependencies?: (string | DependencyId)[];
    modules?: (string | ModuleId)[];
    configs?: (string | ConfigId)[];
    resources?: (string | ResourceId)[];
    translations?: (string | Exclude<TranslateUnitId, 'locale'>)[];
    preloader?: React.ReactNode;
};

export type AddedHocProps = {
    dependencies: Array<unknown>;
    modules: Array<unknown>;
    configs: Array<unknown>;
    resources: Array<unknown>;
    translators: Array<Translator>;
};

/**
 * @function createDependenciesHoc
 * @param coreGlobalRegisterName {string} Global name of registered Core.
 * @returns React hoc for dependencies preload before use them in component.
 */
export const createDependenciesHoc = (coreGlobalRegisterName: string) =>
    /**
     * @function anonym
     * @description React hoc for dependencies preload.
     * @param component {React.FC<P>} React functional component.
     * @param options {DependenciesHocOptions} Options of hoc.
     * @returns {React.FC<P>}
     * */
    <P>(
        component: React.FC<P & { $injected: AddedHocProps }>,
        options: DependenciesHocOptions = {},
    ): React.FC<P> => {
        const {
            dependencies,
            modules,
            configs,
            resources,
            translations,
            preloader,
        } = options;

        return function WithDependenciesHoc(props) {
            const core = global[coreGlobalRegisterName] as Core;

            const resolvedModules =
                modules?.map((moduleId) => {
                    const id = resolveId<ModuleId>(moduleId);
                    return core.useModule(id.key, id.context);
                }) ?? [];

            const resolvedDependencies =
                dependencies?.map((dependencyId) => {
                    if (typeof dependencyId === 'string') {
                        return core.useDependency(dependencyId, true);
                    } else if (typeof dependencyId === 'object') {
                        return core.useModuleDependency(
                            dependencyId.moduleId,
                            dependencyId.key,
                            true,
                        );
                    }
                }) ?? [];

            const resolvedConfigs =
                configs?.map((configId) => {
                    const id = resolveId<ConfigId>(configId);
                    return core.useConfig(id.key, id.context);
                }) ?? [];

            const resolvedResources =
                resources?.map((resourceId) => {
                    const id = resolveId<ResourceId>(resourceId);
                    return core.useResource(id.key, id.context);
                }) ?? [];

            const resolvedTranslators =
                translations?.map((translationId) => {
                    const id = resolveId<TranslateUnitId>(translationId);
                    return core.useTranslator(id.key, id.context);
                }) ?? [];

            const isNotReady =
                resolvedModules.findIndex((it) => !it) >= 0 ||
                resolvedDependencies.findIndex((it) => !it) >= 0 ||
                resolvedConfigs.findIndex((it) => !it) >= 0 ||
                resolvedResources.findIndex((it) => !it) >= 0 ||
                resolvedTranslators.findIndex(([, isReady]) => !isReady) >= 0;

            if (isNotReady) {
                return React.createElement(
                    React.Fragment,
                    {},
                    preloader || null,
                );
            }

            const addedProps: AddedHocProps = {
                dependencies: resolvedDependencies,
                modules: resolvedModules,
                configs: resolvedConfigs,
                resources: resolvedResources,
                translators: resolvedTranslators.map(([t]) => t),
            };

            return React.createElement(
                component,
                { ...props, $injected: addedProps },
                props.children,
            );
        };
    };

const resolveId = <T extends { key: string } = { key: string }>(
    id: string | T,
): T => {
    return (typeof id === 'object' ? id : { key: id }) as T;
};
