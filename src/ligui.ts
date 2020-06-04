import * as Container from 'bottlejs';
import {
    createStore,
    getState,
    getStore,
    isStoreExist,
    setStoreDevTool,
    Store
} from '@sardonyxwt/state-store';
import {
    createEventBus,
    getEventBus,
    isEventBusExist,
    setEventBusDevTool,
    EventBus
} from '@sardonyxwt/event-bus';

import { LIGUI_TYPES } from './types';
import { createContext, Context } from './context';

import { Module, ModuleStore, createModuleStore } from './store/module.store';
import { Resource, ResourceStore, createResourceStore } from './store/resource.store';
import { InternationalizationStore, createInternationalizationStore, TranslateUnit } from './store/internationalization.store';
import { Config, ConfigStore, createConfigStore } from './store/config.store';

import { JSXService, JSXServiceImpl } from './service/jsx.service';
import { ResourceLoader, ResourceService, ResourceServiceImpl } from './service/resource.service';
import {
    InternationalizationService,
    InternationalizationServiceImpl,
    TranslateUnitLoader
} from './service/internationalization.service';
import { ConfigService, ConfigServiceImpl, ConfigLoader } from './service/config.service';
import { ModuleLoader, ModuleService, ModuleServiceImpl } from './service/module.service';
import { RepositoryService, RepositoryServiceImpl } from './service/repository.service';

import { useData } from './hook/data.hook';
import { useId } from './hook/id.hook';
import { useRef } from './hook/ref.hook';
import { createStateHook } from './hook/state.hook';
import { createEventHook } from './hook/event.hook';
import { createModuleHook } from './hook/module.hook';
import { createResourceHook } from './hook/resource.hook';
import {
    createDependencyHook
} from './hook/dependency.hook';
import {
    createI18nHook,
    createTranslatorHook
} from './hook/internationalization.hook';
import { createConfigHook } from './hook/config.hook';

export * from '@sardonyxwt/event-bus';
export * from '@sardonyxwt/state-store';
export * from './types';
export * from './context';

export * from './store/module.store';
export * from './store/resource.store';
export * from './store/internationalization.store';
export * from './store/config.store';

export * from './service/jsx.service';
export * from './service/internationalization.service';
export * from './service/config.service';
export * from './service/resource.service';
export * from './service/module.service';
export * from './service/repository.service';

export * from './hook/data.hook';
export * from './hook/id.hook';
export * from './hook/ref.hook';
export * from './hook/state.hook';
export * from './hook/event.hook';
export * from './hook/dependency.hook';
export * from './hook/internationalization.hook';
export * from './hook/config.hook';
export * from './hook/module.hook';
export * from './hook/resource.hook';

export { Container };

export interface LiguiConfig {
    name: string;
    bottle?: Container;
    modules?: Module[];
    resources?: Resource[];
    configs?: Config[];
    locales?: string[];
    currentLocale?: string;
    defaultLocale?: string;
    translateUnits?: TranslateUnit[];
    moduleLoaders?: ModuleLoader[];
    resourceLoaders?: ResourceLoader[];
    internationalizationLoaders?: TranslateUnitLoader[];
    configLoaders?: ConfigLoader[];
}

export interface Ligui {
    readonly jsx: JSXService;
    readonly resource: {
        store: ResourceStore;
        service: ResourceService;
    };
    readonly internationalization: {
        store: InternationalizationStore;
        service: InternationalizationService;
    };
    readonly config: {
        store: ConfigStore;
        service: ConfigService;
    };
    readonly module: {
        store: ModuleStore;
        service: ModuleService;
    };
    readonly repository: RepositoryService;
    readonly context: Context;
    readonly store: Store;
    readonly eventBus: EventBus;
    readonly bottle: Container;
    readonly container: Container.IContainer;

    createStore: typeof createStore;
    isStoreExist: typeof isStoreExist;
    getStore: typeof getStore;
    getState: typeof getState;
    setStoreDevTool: typeof setStoreDevTool;

    createEventBus: typeof createEventBus;
    isEventBusExist: typeof isEventBusExist;
    getEventBus: typeof getEventBus;
    setEventBusDevTool: typeof setEventBusDevTool;

    useId: typeof useId;
    useRef: typeof useRef;
    useData: typeof useData;
    useState: ReturnType<typeof createStateHook>;
    useEvent: ReturnType<typeof createEventHook>;
    useDependency: ReturnType<typeof createDependencyHook>;
    useModule: ReturnType<typeof createModuleHook>;
    useResource: ReturnType<typeof createResourceHook>;
    useI18n: ReturnType<typeof createI18nHook>;
    useTranslator: ReturnType<typeof createTranslatorHook>;
    useConfig: ReturnType<typeof createConfigHook>;
}

export function createNewLiguiInstance(config: LiguiConfig): Ligui {
    // Check Ligui instance is present for HMR
    if (!!global[config.name]) {
        throw new Error(`Ligui instance present in global object with name: ${config.name}`);
    }

    const context = createContext(config.name, config.bottle);

    context.bottle.constant(LIGUI_TYPES.STORE, context.store);
    context.bottle.constant(LIGUI_TYPES.EVENT_BUS, context.eventBus);

    context.bottle.factory(
        LIGUI_TYPES.CONFIG_STORE,
        () => createConfigStore(context.store, {
            configs: config.configs
        })
    );

    context.bottle.factory(
        LIGUI_TYPES.INTERNATIONALIZATION_STORE,
        () => createInternationalizationStore(context.store, {
            locales: config.locales,
            currentLocale: config.currentLocale,
            defaultLocale: config.defaultLocale,
            translateUnits: config.translateUnits
        })
    );

    context.bottle.factory(
        LIGUI_TYPES.MODULE_STORE,
        () => createModuleStore(context.store, {
            modules: config.modules
        })
    );

    context.bottle.factory(
        LIGUI_TYPES.RESOURCE_STORE,
        () => createResourceStore(context.store, {
            resources: config.resources
        })
    );

    context.bottle.factory(
        LIGUI_TYPES.CONFIG_SERVICE,
        (container) => new ConfigServiceImpl(
            container[LIGUI_TYPES.CONFIG_STORE] as ConfigStore,
            config.configLoaders
        )
    );

    context.bottle.factory(
        LIGUI_TYPES.INTERNATIONALIZATION_SERVICE,
        (container) => new InternationalizationServiceImpl(
            container[LIGUI_TYPES.INTERNATIONALIZATION_STORE] as InternationalizationStore,
            config.internationalizationLoaders
        )
    );

    context.bottle.factory(
        LIGUI_TYPES.JSX_SERVICE,
        () => new JSXServiceImpl()
    );

    context.bottle.factory(
        LIGUI_TYPES.MODULE_SERVICE,
        (container) => new ModuleServiceImpl(
            container[LIGUI_TYPES.MODULE_STORE] as ModuleStore,
            config.moduleLoaders
        )
    );

    context.bottle.factory(
        LIGUI_TYPES.REPOSITORY_SERVICE,
        () => new RepositoryServiceImpl()
    );

    context.bottle.factory(
        LIGUI_TYPES.RESOURCE_SERVICE,
        (container) => new ResourceServiceImpl(
            container[LIGUI_TYPES.RESOURCE_STORE] as ResourceStore,
            config.resourceLoaders
        )
    );

    const ligui: Ligui = {
        get jsx() {
            return context.bottle.container[LIGUI_TYPES.JSX_SERVICE] as JSXService;
        },
        get resource() {
            return {
                store: context.bottle.container[LIGUI_TYPES.RESOURCE_STORE] as ResourceStore,
                service: context.bottle.container[LIGUI_TYPES.RESOURCE_SERVICE] as ResourceService
            };
        },
        get internationalization() {
            return {
                store: context.bottle.container[LIGUI_TYPES.INTERNATIONALIZATION_STORE] as InternationalizationStore,
                service: context.bottle.container[LIGUI_TYPES.INTERNATIONALIZATION_SERVICE] as InternationalizationService
            };
        },
        get config() {
            return {
                store: context.bottle.container[LIGUI_TYPES.CONFIG_STORE] as ConfigStore,
                service: context.bottle.container[LIGUI_TYPES.CONFIG_SERVICE] as ConfigService
            };
        },
        get module() {
            return {
                store: context.bottle.container[LIGUI_TYPES.MODULE_STORE] as ModuleStore,
                service: context.bottle.container[LIGUI_TYPES.MODULE_SERVICE] as ModuleService
            }
        },
        get repository() {
            return context.bottle.container[LIGUI_TYPES.REPOSITORY_SERVICE] as RepositoryService;
        },
        get context() {
            return context;
        },
        get store() {
            return context.store;
        },
        get eventBus() {
            return context.eventBus;
        },
        get bottle() {
            return context.bottle;
        },
        get container() {
            return context.bottle.container;
        },

        createStore: createStore,
        isStoreExist: isStoreExist,
        getState: getState,
        getStore: getStore,
        setStoreDevTool: setStoreDevTool,

        createEventBus: createEventBus,
        isEventBusExist: isEventBusExist,
        getEventBus: getEventBus,
        setEventBusDevTool: setEventBusDevTool,

        useId,
        useRef,
        useData,
        useState: createStateHook(context.store),
        useEvent: createEventHook(context.eventBus),
        useModule: createModuleHook(context.bottle.container),
        useResource: createResourceHook(context.bottle.container),
        useI18n: createI18nHook(context.bottle.container),
        useTranslator: createTranslatorHook(context.bottle.container),
        useConfig: createConfigHook(context.bottle.container),
        useDependency: createDependencyHook(context.bottle.container),
    };

    global[config.name] = ligui;

    return ligui;
}
