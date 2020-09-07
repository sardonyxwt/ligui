import Container from 'bottlejs';
import {
    createEventBus,
    getEventBus,
    isEventBusExist,
    setEventBusDevTool,
} from '@sardonyxwt/event-bus';

import { CoreTypes } from './types';
import { createContext } from './context';

import { ModuleStore, createModuleStore } from './store/module.store';
import { ResourceStore, createResourceStore } from './store/resource.store';
import {
    InternationalizationStore,
    createInternationalizationStore,
} from './store/internationalization.store';
import { ConfigStore, createConfigStore } from './store/config.store';

import {
    ResourceService,
    ResourceServiceImpl,
} from './service/resource.service';
import {
    InternationalizationService,
    InternationalizationServiceImpl,
} from './service/internationalization.service';
import { ConfigService, ConfigServiceImpl } from './service/config.service';
import { ModuleService, ModuleServiceImpl } from './service/module.service';

import { useData } from './hook/data.hook';
import { useId } from './hook/id.hook';
import { useDynamicRef } from './hook/dynamic-ref.hook';
import { createStateHook } from './hook/state.hook';
import { createEventHook } from './hook/event.hook';
import { createModuleHook } from './hook/module.hook';
import { createResourceHook } from './hook/resource.hook';
import {
    createDependencyHook,
    createModuleDependencyHook,
} from './hook/dependency.hook';
import {
    createI18nHook,
    createTranslatorHook,
} from './hook/internationalization.hook';
import { createConfigHook } from './hook/config.hook';

import { ModalControllerImpl } from './controller/modal.controller.component';
import { ToastControllerImpl } from './controller/toast.controller.component';
import { CoreConfig, Core } from './core';

export * from '@sardonyxwt/state-store';
export * from '@sardonyxwt/event-bus';

export * from './types';
export * from './context';

export * from './store/module.store';
export * from './store/resource.store';
export * from './store/internationalization.store';
export * from './store/config.store';

export * from './service/internationalization.service';
export * from './service/config.service';
export * from './service/resource.service';
export * from './service/module.service';

export * from './hook/data.hook';
export * from './hook/id.hook';
export * from './hook/dynamic-ref.hook';
export * from './hook/event.hook';
export * from './hook/dependency.hook';
export * from './hook/internationalization.hook';
export * from './hook/config.hook';
export * from './hook/module.hook';
export * from './hook/resource.hook';
export * from './hook/state.hook';

export * from './hoc/dependencies.hoc';

export * from './controller/modal.controller.component';
export * from './controller/toast.controller.component';

export * from './util/validation.utils';
export * from './util/exception.utils';
export * from './util/converter.utils';
export * from './util/generator.util';
export * from './util/object.utils';
export * from './util/path.utils';
export * from './util/jsx.utils';
export * from './util/url.utils';

export * from './context/module.context';

export * from './core';

export { Container };

/**
 * @function createCoreInstance
 * @description Create core instance and register it on global.
 * @param config {CoreConfig} Initial config for core module.
 * @returns {Core}
 */
export function createCoreInstance(config: CoreConfig): Core {
    // Check Core instance is present for HMR
    if (!!global[config.name]) {
        throw new Error(
            `Core instance present in global object with name: ${config.name}`,
        );
    }

    const context = createContext(config.name, config.bottle);

    context.bottle.constant(CoreTypes.EventBus, context.eventBus);

    context.bottle.factory(CoreTypes.ConfigStore, () =>
        createConfigStore(context.store, {
            configs: config.configs,
        }),
    );

    context.bottle.factory(CoreTypes.InternationalizationStore, () =>
        createInternationalizationStore(context.store, {
            locales: config.locales,
            currentLocale: config.currentLocale,
            defaultLocale: config.defaultLocale,
            translateUnits: config.translateUnits,
        }),
    );

    context.bottle.factory(CoreTypes.ModuleStore, () =>
        createModuleStore(context.store, {
            modules: config.modules,
        }),
    );

    context.bottle.factory(CoreTypes.ResourceStore, () =>
        createResourceStore(context.store, {
            resources: config.resources,
        }),
    );

    context.bottle.factory(
        CoreTypes.ConfigService,
        (container) =>
            new ConfigServiceImpl(
                container[CoreTypes.ConfigStore] as ConfigStore,
                config.configLoaders,
            ),
    );

    context.bottle.factory(
        CoreTypes.InternationalizationService,
        (container) =>
            new InternationalizationServiceImpl(
                container[
                    CoreTypes.InternationalizationStore
                ] as InternationalizationStore,
                config.translateUnitLoaders,
            ),
    );

    context.bottle.factory(
        CoreTypes.ModuleService,
        (container) =>
            new ModuleServiceImpl(
                container[CoreTypes.ModuleStore] as ModuleStore,
                config.moduleLoaders,
            ),
    );

    context.bottle.factory(
        CoreTypes.ResourceService,
        (container) =>
            new ResourceServiceImpl(
                container[CoreTypes.ResourceStore] as ResourceStore,
                config.resourceLoaders,
            ),
    );

    context.bottle.factory(
        CoreTypes.ModalController,
        () => ModalControllerImpl.instance,
    );

    context.bottle.factory(
        CoreTypes.ToastController,
        () => ToastControllerImpl.instance,
    );

    const core: Core = {
        get resource() {
            return {
                get store() {
                    return context.bottle.container[
                        CoreTypes.ResourceStore
                    ] as ResourceStore;
                },
                get service() {
                    return context.bottle.container[
                        CoreTypes.ResourceService
                    ] as ResourceService;
                },
            };
        },
        get internationalization() {
            return {
                get store() {
                    return context.bottle.container[
                        CoreTypes.InternationalizationStore
                    ] as InternationalizationStore;
                },
                get service() {
                    return context.bottle.container[
                        CoreTypes.InternationalizationService
                    ] as InternationalizationService;
                },
            };
        },
        get config() {
            return {
                get store() {
                    return context.bottle.container[
                        CoreTypes.ConfigStore
                    ] as ConfigStore;
                },
                get service() {
                    return context.bottle.container[
                        CoreTypes.ConfigService
                    ] as ConfigService;
                },
            };
        },
        get module() {
            return {
                get store() {
                    return context.bottle.container[
                        CoreTypes.ModuleStore
                    ] as ModuleStore;
                },
                get service() {
                    return context.bottle.container[
                        CoreTypes.ModuleService
                    ] as ModuleService;
                },
            };
        },
        get modal() {
            return context.bottle.container[CoreTypes.ModalController];
        },
        get toast() {
            return context.bottle.container[CoreTypes.ToastController];
        },
        get context() {
            return context;
        },
        get eventBus() {
            return context.eventBus;
        },
        get store() {
            return context.store;
        },
        get bottle() {
            return context.bottle;
        },
        get container() {
            return context.bottle.container;
        },

        createEventBus: createEventBus,
        isEventBusExist: isEventBusExist,
        getEventBus: getEventBus,
        setEventBusDevTool: setEventBusDevTool,

        useId,
        useData,
        useDynamicRef,
        useState: createStateHook(config.name),
        useEvent: createEventHook(config.name),
        useModule: createModuleHook(config.name),
        useResource: createResourceHook(config.name),
        useI18n: createI18nHook(config.name),
        useTranslator: createTranslatorHook(config.name),
        useConfig: createConfigHook(config.name),
        useDependency: createDependencyHook(config.name),
        useModuleDependency: createModuleDependencyHook(config.name),
    };

    global[config.name] = core;

    return core;
}
