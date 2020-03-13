import { Container } from 'inversify';
import {
    createStore,
    getState,
    getStore,
    isStoreExist,
    setStoreDevTool,
    Store,
    StoreDevTool
} from '@sardonyxwt/state-store';
import {
    createEventBus,
    getEventBus,
    isEventBusExist,
    setEventBusDevTool,
    EventBusDevTool, EventBus
} from '@sardonyxwt/event-bus';

import { LIGUI_TYPES } from './types';
import { createContext, Context } from './context';

import { Module, ModuleStore, ModuleStoreImpl } from './store/module.store';
import { Resource, ResourceStore, ResourceStoreImpl } from './store/resource.store';
import { InternationalizationStore, InternationalizationStoreImpl, TranslateUnit } from './store/internationalization.store';
import { Config, ConfigStore, ConfigStoreImpl } from './store/config.store';

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
import { createModuleHook } from './hook/module.hook';
import { createResourceHook } from './hook/resource.hook';
import {
    createDependenciesHook,
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
export * from './hook/dependency.hook';
export * from './hook/internationalization.hook';
export * from './hook/config.hook';
export * from './hook/module.hook';
export * from './hook/resource.hook';

export interface LiguiConfig {
    name: string;
    container?: Container;
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
    readonly container: Container;

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
    useDependency: ReturnType<typeof createDependencyHook>;
    useDependencies: ReturnType<typeof createDependenciesHook>;
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

    const context = createContext(config.name, config.container);

    context.container.bind<Store>(LIGUI_TYPES.STORE).toConstantValue(context.store);

    context.container.bind<ModuleStore>(LIGUI_TYPES.MODULE_STORE)
        .toDynamicValue(() => new ModuleStoreImpl(config.modules))
        .inSingletonScope();
    context.container.bind<ResourceStore>(LIGUI_TYPES.RESOURCE_STORE)
        .toDynamicValue(() => new ResourceStoreImpl(config.resources))
        .inSingletonScope();
    context.container.bind<InternationalizationStore>(LIGUI_TYPES.INTERNATIONALIZATION_STORE)
        .toDynamicValue(() => new InternationalizationStoreImpl(
            config.locales,
            config.currentLocale,
            config.defaultLocale,
            config.translateUnits
        ))
        .inSingletonScope();
    context.container.bind<ConfigStore>(LIGUI_TYPES.CONFIG_STORE)
        .toDynamicValue(() => new ConfigStoreImpl(config.configs))
        .inSingletonScope();

    context.container.bind<JSXService>(LIGUI_TYPES.JSX_SERVICE)
        .toDynamicValue(() => new JSXServiceImpl())
        .inSingletonScope();
    context.container.bind<ModuleService>(LIGUI_TYPES.MODULE_SERVICE)
        .toDynamicValue(context => new ModuleServiceImpl(
            context.container.get<ModuleStore>(LIGUI_TYPES.MODULE_STORE),
            config.moduleLoaders
        ))
        .inSingletonScope();
    context.container.bind<ResourceService>(LIGUI_TYPES.RESOURCE_SERVICE)
        .toDynamicValue(context => new ResourceServiceImpl(
            context.container.get<ResourceStore>(LIGUI_TYPES.RESOURCE_STORE),
            config.resourceLoaders
        ))
        .inSingletonScope();
    context.container.bind<InternationalizationService>(LIGUI_TYPES.INTERNATIONALIZATION_SERVICE)
        .toDynamicValue(context => new InternationalizationServiceImpl(
            context.container.get<InternationalizationStore>(LIGUI_TYPES.INTERNATIONALIZATION_STORE),
            config.internationalizationLoaders
        ))
        .inSingletonScope();
    context.container.bind<ConfigService>(LIGUI_TYPES.CONFIG_SERVICE)
        .toDynamicValue(context => new ConfigServiceImpl(
            context.container.get<ConfigStore>(LIGUI_TYPES.CONFIG_STORE),
            config.configLoaders
        ))
        .inSingletonScope();
    context.container.bind<RepositoryService>(LIGUI_TYPES.REPOSITORY_SERVICE)
        .toDynamicValue(() => new RepositoryServiceImpl())
        .inSingletonScope();

    const ligui: Ligui = {
        get jsx() {
            return context.container.get<JSXService>(LIGUI_TYPES.JSX_SERVICE);
        },
        get resource() {
            return {
                store: context.container.get<ResourceStore>(LIGUI_TYPES.RESOURCE_STORE),
                service: context.container.get<ResourceService>(LIGUI_TYPES.RESOURCE_SERVICE)
            };
        },
        get internationalization() {
            return {
                store: context.container.get<InternationalizationStore>(LIGUI_TYPES.INTERNATIONALIZATION_STORE),
                service: context.container.get<InternationalizationService>(LIGUI_TYPES.INTERNATIONALIZATION_SERVICE)
            };
        },
        get config() {
            return {
                store: context.container.get<ConfigStore>(LIGUI_TYPES.CONFIG_STORE),
                service: context.container.get<ConfigService>(LIGUI_TYPES.CONFIG_SERVICE)
            };
        },
        get module() {
            return {
                store: context.container.get<ModuleStore>(LIGUI_TYPES.MODULE_STORE),
                service: context.container.get<ModuleService>(LIGUI_TYPES.MODULE_SERVICE)
            }
        },
        get repository() {
            return context.container.get<RepositoryService>(LIGUI_TYPES.REPOSITORY_SERVICE);
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
        get container() {
            return context.container;
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
        useModule: createModuleHook(context.container),
        useResource: createResourceHook(context.container),
        useI18n: createI18nHook(context.container),
        useTranslator: createTranslatorHook(context.container),
        useConfig: createConfigHook(context.container),
        useDependency: createDependencyHook(context.container),
        useDependencies: createDependenciesHook(context.container),
    };

    global[config.name] = ligui;

    return ligui;
}

export const defaultStoreDevTool: Partial<StoreDevTool> = {
    onCreateStore: store => console.log(`Store(${store.name}) created: `, store),
    onChangeStore: store => console.log(`Store(${store.name}) changed: `, store),
    onCreateScope: scope => console.log(`Scope(${scope.name}) created: `, scope),
    onChangeScope: scope => console.log(`Scope(${scope.name}) changed: `, scope),
    onAction: event =>
        console.log(`Scope(${event.scopeName}) event(${event.actionName}) dispatched: `, event),
    onActionError: error =>
        console.error(`Scope(${error.scopeName}) event(${error.actionName}) dispatched error: `, error),
    onActionListenerError: error =>
        console.error(`Scope(${error.scopeName}) event(${error.actionName}) listener error: `, error)
};

export const defaultEventBusDevTool: Partial<EventBusDevTool> = {
    onCreate: eventBus => console.log(`EventBus(${eventBus.name}) created: `, eventBus),
    onEvent: event => console.log(`EventBus(${event.eventBusName}) event(${event.eventName}) published: `, event)
};
