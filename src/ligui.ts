import 'reflect-metadata';
import { Context, createContext } from './context';
import { createUniqueIdGenerator, generateSalt, generateUUID, Generator } from '@sardonyxwt/utils/generator';
import { deepFreeze, flatten, stringifyValue, unflatten } from '@sardonyxwt/utils/object';
import {
    arrayFrom,
    clone,
    cloneArray,
    cloneArrays,
    copyArray,
    copyArrays,
    deleteFromArray,
    resolveArray,
    resolveValue,
    saveToArray
} from './extension/util.extension';
import {
    charFromHexCode,
    deferred,
    DeferredCall,
    prepareFunctionCall,
    resolveFunctionCall
} from './extension/function.extension';
import { Parameters, ReturnType } from './extension/data.extension';
import { JSXService, JSXServiceImpl } from './service/jsx.service';
import { RestService, RestServiceImpl } from './service/rest.service';
import { ResourceDataLoader, ResourceService, ResourceServiceImpl } from './service/resource.service';
import {
    InternationalizationService,
    InternationalizationServiceImpl,
    TranslateUnitDataLoader
} from './service/internationalization.service';
import { ModuleBodyLoader, ModuleService, ModuleServiceImpl } from './service/module.service';
import { useCurrent } from './hook/current.hook';
import { useData } from './hook/data.hook';
import { useId } from './hook/id.hook';
import { useRef } from './hook/ref.hook';
import { usePocket } from './hook/pocket.hook';
import { createStateHook } from './hook/state.hook';
import { ContainerKey, createDependenciesHook, createDependencyHook } from './hook/dependency.hook';
import { createI18nHook, InternationalizationHookReturnType } from './hook/internationalization.hook';
import { createModuleHook } from './hook/module.hook';
import { createResourceHook } from './hook/resource.hook';
import { createModuleScope, ModuleScopeOptions } from './scope/module.scope';
import { createResourceScope, ResourceScopeOptions } from './scope/resource.scope';
import { createInternationalizationScope, InternationalizationScopeOptions } from './scope/internationalization.scope';
import {
    createStore,
    getState,
    getStore,
    isStoreExist,
    setStoreDevTool,
    Store,
    StoreConfig,
    StoreDevTool
} from '@sardonyxwt/state-store';
import {
    createEventBus,
    EventBus,
    EventBusConfig,
    EventBusDevTool,
    getEventBus,
    isEventBusExist,
    setEventBusDevTool
} from '@sardonyxwt/event-bus';
import { Container, interfaces } from 'inversify';
import { LIGUI_TYPES } from './types';
import * as React from 'react';

export * from 'inversify';
export * from './types';
export * from './context';
export * from './extension/converter.extension';
export * from './extension/util.extension';
export * from './extension/entity.extension';
export * from './extension/data.extension';
export * from './extension/function.extension';
export * from './scope/module.scope';
export * from './scope/resource.scope';
export * from './scope/internationalization.scope';
export * from './service/jsx.service';
export * from './service/internationalization.service';
export * from './service/resource.service';
export * from './service/rest.service';
export * from './service/module.service';
export * from './hook/current.hook';
export * from './hook/data.hook';
export * from './hook/id.hook';
export * from './hook/state.hook';
export * from './hook/pocket.hook';
export * from './hook/ref.hook';
export * from './hook/dependency.hook';
export * from './hook/internationalization.hook';
export * from './hook/module.hook';
export * from './hook/resource.hook';
export * from '@sardonyxwt/state-store';
export * from '@sardonyxwt/event-bus';
export * from '@sardonyxwt/utils/generator';
export * from '@sardonyxwt/utils/object';

export interface LiguiConfig {
    name: string;
    containerOptions: interfaces.ContainerOptions
    moduleScopeOptions: ModuleScopeOptions;
    resourceScopeOptions: ResourceScopeOptions;
    internationalizationScopeOptions: InternationalizationScopeOptions;
    moduleLoaders?: ModuleBodyLoader[];
    resourceLoaders?: ResourceDataLoader[];
    internationalizationLoaders?: TranslateUnitDataLoader[];
}

export interface Ligui {
    readonly jsx: JSXService;
    readonly rest: RestService;
    readonly resource: ResourceService;
    readonly internationalization: InternationalizationService;
    readonly module: ModuleService;
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

    useId: () => string;
    useRef: <T>(initialValue?: T | null) => [React.RefObject<T>, T];
    useData: <T>(dataResolver: () => T,
                 dataLoader?: () => Promise<T>,
                 dataSync?: (cb: (newData: T) => void) => (() => void | void)) => T;
    useState: <T = any>(scopeName: string, actions?: string[], retention?: number) => T;
    usePocket: <T extends {}>(initialValue: T) => T;
    useCurrent: <T>(value: T) => [T, (newValue: T) => void];
    useDependency: <T = any>(id: interfaces.ServiceIdentifier<T>, keyOrName?: ContainerKey, value?: any) => T;
    useDependencies: <T = any>(id: interfaces.ServiceIdentifier<T>, keyOrName?: ContainerKey, value?: any) => T[];
    useModule: <T = any>(key: string, context?: string) => T;
    useResource: <T = any>(key: string, context?: string) => T;
    useI18n: (keys: string[], context?: string) => InternationalizationHookReturnType;

    clone: <T>(source: T) => T;
    cloneArray: <T>(sources: T[]) => T[];
    cloneArrays: <T>(...sources: (T[])[]) => T[];
    copyArray: <T>(sources: T[]) => T[];
    copyArrays: <T>(...sources: (T[])[]) => T[];
    resolveArray: <T>(source: T | T[]) => T[];
    arrayFrom: <T>(...sources: (T | T[])[]) => T[];
    resolveValue: (object, path: string) => any;
    saveToArray: <T>(
        array: T[],
        newEl: T,
        compareFn?: (arrEl: T, newEl: T, index: number, arr: T[]) => boolean
    ) => void;
    deleteFromArray: <T>(array: T[], compareFn?: (arrEl: T, index: number, arr: T[]) => boolean) => void;

    generateUUID: Generator<string>;
    generateSalt: Generator<string>;
    createUniqueIdGenerator: (prefix: string) => Generator<string>;

    flatten: (data: object) => object;
    unflatten: (data: object) => object;
    stringifyValue: (value) => string;
    deepFreeze: <T>(obj: T) => Readonly<T>;

    deferred: DeferredCall;

    charFromHexCode: (hexCode: string) => string;

    resolveFunctionCall: <T extends Function | undefined | null>(func: T, ...flags: boolean[]) => T;
    prepareFunctionCall: <T extends Function | undefined | null>(func: T, ...flags: boolean[]) =>
        ((...args: Parameters<typeof func>) => () => ReturnType<typeof func>);
}

export function createNewLiguiInstance(config: LiguiConfig): Ligui {
    // Check Ligui instance is present for HMR
    if (!!global[config.name]) {
        return global[config.name];
    }

    const context = createContext(config.name, config.containerOptions);

    const moduleScope = createModuleScope(context.store, config.moduleScopeOptions);
    const resourceScope = createResourceScope(context.store, config.resourceScopeOptions);
    const localizationScope = createInternationalizationScope(context.store, config.internationalizationScopeOptions);

    context.container.bind(LIGUI_TYPES.MODULE_SCOPE).toConstantValue(moduleScope);
    context.container.bind(LIGUI_TYPES.RESOURCE_SCOPE).toConstantValue(resourceScope);
    context.container.bind(LIGUI_TYPES.INTERNATIONALIZATION_SCOPE).toConstantValue(localizationScope);

    context.container.bind<JSXService>(LIGUI_TYPES.JSX_SERVICE)
        .toDynamicValue(() =>
            new JSXServiceImpl()).inSingletonScope();
    context.container.bind<RestService>(LIGUI_TYPES.REST_SERVICE)
        .toDynamicValue(() =>
            new RestServiceImpl()).inSingletonScope();
    context.container.bind<ModuleService>(LIGUI_TYPES.MODULE_SERVICE)
        .toDynamicValue(() =>
            new ModuleServiceImpl(moduleScope, config.moduleLoaders))
        .inSingletonScope();
    context.container.bind<ResourceService>(LIGUI_TYPES.RESOURCE_SERVICE)
        .toDynamicValue(() =>
            new ResourceServiceImpl(resourceScope, config.resourceLoaders))
        .inSingletonScope();
    context.container.bind<InternationalizationService>(LIGUI_TYPES.INTERNATIONALIZATION_SERVICE)
        .toDynamicValue(() =>
            new InternationalizationServiceImpl(localizationScope, config.internationalizationLoaders))
        .inSingletonScope();

    const ligui: Ligui = {
        get jsx() {
            return context.container.get<JSXService>(LIGUI_TYPES.JSX_SERVICE);
        },
        get rest() {
            return context.container.get<RestService>(LIGUI_TYPES.REST_SERVICE);
        },
        get resource() {
            return context.container.get<ResourceService>(LIGUI_TYPES.RESOURCE_SERVICE);
        },
        get internationalization() {
            return context.container.get<InternationalizationService>(LIGUI_TYPES.INTERNATIONALIZATION_SERVICE);
        },
        get module() {
            return context.container.get<ModuleService>(LIGUI_TYPES.MODULE_SERVICE);
        },
        get context() {
            return context;
        },
        get store() {
            return context.store;
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
        usePocket,
        useCurrent,
        useState: createStateHook(context.store),
        useModule: createModuleHook(context.container),
        useResource: createResourceHook(context.container),
        useI18n: createI18nHook(context.container),
        useDependency: createDependencyHook(context.container),
        useDependencies: createDependenciesHook(context.container),

        clone,
        cloneArray,
        cloneArrays,
        copyArray,
        copyArrays,
        resolveArray,
        arrayFrom,
        resolveValue,
        saveToArray,
        deleteFromArray,

        generateUUID,
        generateSalt,
        createUniqueIdGenerator,

        flatten,
        unflatten,
        stringifyValue,
        deepFreeze,

        deferred,

        charFromHexCode,

        resolveFunctionCall,
        prepareFunctionCall,
    };

    global[config.name] = ligui;

    return ligui;
}
