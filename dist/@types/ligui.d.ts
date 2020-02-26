import { Container, interfaces } from 'inversify';
import { Store, StoreConfig, StoreDevTool } from '@sardonyxwt/state-store';
import { EventBus, EventBusConfig, EventBusDevTool } from '@sardonyxwt/event-bus';
import { Context } from './context';
import { Module, ModuleStore } from './store/module.store';
import { Resource, ResourceStore } from './store/resource.store';
import { InternationalizationStore, TranslateUnit } from './store/internationalization.store';
import { Config, ConfigStore } from './store/config.store';
import { JSXService } from './service/jsx.service';
import { ResourceLoader, ResourceService } from './service/resource.service';
import { InternationalizationService, TranslateUnitLoader } from './service/internationalization.service';
import { ConfigService, ConfigLoader } from './service/config.service';
import { ModuleLoader, ModuleService } from './service/module.service';
import { ContainerKey } from './hook/dependency.hook';
import { InternationalizationHookReturnType, TranslatorHookReturnType } from './hook/internationalization.hook';
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
export * from './hook/data.hook';
export * from './hook/id.hook';
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
    readonly context: Context;
    readonly store: Store;
    readonly container: Container;
    createStore(config: StoreConfig): Store;
    isStoreExist(storeName: string): boolean;
    getStore(storeName: string): Store;
    getState(): {};
    setStoreDevTool(devTool: Partial<StoreDevTool>): void;
    createEventBus(config?: EventBusConfig): EventBus;
    isEventBusExist(storeName: string): boolean;
    getEventBus(scopeName: string): EventBus;
    setEventBusDevTool(devTool: Partial<EventBusDevTool>): void;
    reset(): void;
    useId: () => string;
    useData: <T>(dataResolver: () => T, dataLoader?: () => Promise<T>, dataSync?: (cb: (newData: T) => void) => (() => void) | void) => T;
    useState: <T = any>(scopeName: string, actions?: string[], retention?: number) => T;
    useDependency: <T = any>(id: interfaces.ServiceIdentifier<T>, keyOrName?: ContainerKey, value?: any) => T;
    useDependencies: <T = any>(id: interfaces.ServiceIdentifier<T>, keyOrName?: ContainerKey, value?: any) => T[];
    useModule: <T = any>(key: string, context?: string) => T;
    useResource: <T = any>(key: string, context?: string) => T;
    useI18n: () => InternationalizationHookReturnType;
    useTranslator: (key: string, context?: string) => TranslatorHookReturnType;
    useConfig: <T extends {}>(key: string, context?: string) => T;
}
export declare function createNewLiguiInstance(config: LiguiConfig): Ligui;
export declare const defaultStoreDevTool: Partial<StoreDevTool>;
export declare const defaultEventBusDevTool: Partial<EventBusDevTool>;
//# sourceMappingURL=ligui.d.ts.map