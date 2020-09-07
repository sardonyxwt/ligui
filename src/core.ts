import Container from 'bottlejs';
import {
    createEventBus,
    getEventBus,
    isEventBusExist,
    setEventBusDevTool,
    EventBus,
} from '@sardonyxwt/event-bus';

import { Context } from './context';

import { Module, ModuleStore } from './store/module.store';
import { Resource, ResourceStore } from './store/resource.store';
import {
    InternationalizationStore,
    TranslateUnit,
} from './store/internationalization.store';
import { Config, ConfigStore } from './store/config.store';

import { ResourceLoader, ResourceService } from './service/resource.service';
import {
    InternationalizationService,
    TranslateUnitLoader,
} from './service/internationalization.service';
import { ConfigService, ConfigLoader } from './service/config.service';
import { ModuleLoader, ModuleService } from './service/module.service';

import { DataHook } from './hook/data.hook';
import { IdHook } from './hook/id.hook';
import { DynamicRefHook } from './hook/dynamic-ref.hook';
import { StateHook } from './hook/state.hook';
import { EventHook } from './hook/event.hook';
import { ModuleHook } from './hook/module.hook';
import { ResourceHook } from './hook/resource.hook';
import { DependencyHook, ModuleDependencyHook } from './hook/dependency.hook';
import { I18nHook, TranslatorHook } from './hook/internationalization.hook';
import { ConfigHook } from './hook/config.hook';

import { ModalController } from './controller/modal.controller.component';
import { ToastController } from './controller/toast.controller.component';
import { Store } from '@sardonyxwt/state-store/lib/types';

/**
 * @interface CoreConfig
 * @description Initialization config for core module
 */
export interface CoreConfig {
    /**
     * @field name
     * @description Name for global scope declaration.
     */
    name: string;
    /**
     * @field bottle
     * @description Bottlejs instance used in core module.
     */
    bottle?: Container;
    /**
     * @field modules
     * @description Predefined modules in application.
     */
    modules?: Module[];
    /**
     * @field resources
     * @description Predefined resources in application.
     */
    resources?: Resource[];
    /**
     * @field configs
     * @description Predefined configs in application.
     */
    configs?: Config[];
    /**
     * @field locales
     * @description Available locales in application.
     */
    locales?: string[];
    /**
     * @field currentLocale
     * @description Current locale of application.
     */
    currentLocale?: string;
    /**
     * @field defaultLocale
     * @description Fallback locale of application.
     */
    defaultLocale?: string;
    /**
     * @field translateUnits
     * @description Predefined translation units in application.
     */
    translateUnits?: TranslateUnit[];
    /**
     * @field moduleLoaders
     * @description Predefined modules loaders.
     */
    moduleLoaders?: ModuleLoader[];
    /**
     * @field resourceLoaders
     * @description Predefined resources loaders.
     */
    resourceLoaders?: ResourceLoader[];
    /**
     * @field translateUnitLoaders
     * @description Predefined translate units loaders.
     */
    translateUnitLoaders?: TranslateUnitLoader[];
    /**
     * @field configLoaders
     * @description Predefined configs loaders.
     */
    configLoaders?: ConfigLoader[];
}

/**
 * @interface Core
 * @description Core module facade.
 */
export type Core = Readonly<{
    resource: {
        store: ResourceStore;
        service: ResourceService;
    };
    internationalization: {
        store: InternationalizationStore;
        service: InternationalizationService;
    };
    config: {
        store: ConfigStore;
        service: ConfigService;
    };
    module: {
        store: ModuleStore;
        service: ModuleService;
    };
    modal: ModalController;
    toast: ToastController;
    context: Context;
    store: Store;
    eventBus: EventBus;
    bottle: Container;
    container: Container.IContainer;

    createEventBus: typeof createEventBus;
    isEventBusExist: typeof isEventBusExist;
    getEventBus: typeof getEventBus;
    setEventBusDevTool: typeof setEventBusDevTool;

    useId: IdHook;
    useData: DataHook;
    useDynamicRef: DynamicRefHook;
    useState: StateHook;
    useEvent: EventHook;
    useDependency: DependencyHook;
    useModuleDependency: ModuleDependencyHook;
    useModule: ModuleHook;
    useResource: ResourceHook;
    useI18n: I18nHook;
    useTranslator: TranslatorHook;
    useConfig: ConfigHook;
}>;
