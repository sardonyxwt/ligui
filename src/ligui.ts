import 'reflect-metadata';
import { Context, createContext } from './context';
import { createUniqueIdGenerator, generateUUID, generateSalt, Generator } from '@sardonyxwt/utils/generator';
import { flatten, unflatten, deepFreeze, stringifyValue } from '@sardonyxwt/utils/object';
import { arrayFrom, clone, cloneArray, cloneArrays, copyArray, copyArrays, resolveArray } from './extension/entity.extension';
import { charFromHexCode, deferred, DeferredCall, prepareFunctionCall, resolveFunctionCall } from './extension/function.extension';
import { Parameters, ReturnType } from './extension/data.extension';
import { JSXServiceImpl, JSXService } from './service/jsx.service';
import { RestServiceImpl, RestService } from './service/rest.service';
import { ResourceServiceImpl, ResourceService, ResourceLoader } from './service/resource.service';
import { LocalizationServiceImpl, LocalizationService, LocalizationLoader, Translator } from './service/localization.service';
import { ModuleServiceImpl, ModuleService, ModuleLoader } from './service/module.service';
import { useCurrent } from './hook/current.hook';
import { useData } from './hook/data.hook';
import { useId } from './hook/id.hook';
import { useRef } from './hook/ref.hook';
import { usePocket } from './hook/pocket.hook';
import { createStateHook } from './hook/state.hook';
import { createDependencyHook, createDependenciesHook, ContainerKey } from './hook/dependency.hook';
import { createTranslatorHook } from './hook/translator.hook';
import { createModuleHook } from './hook/module.hook';
import { createResourceHook } from './hook/resource.hook';
import { ModuleScopeOptions, createModuleScope } from './scope/module.scope';
import { ResourceScopeOptions, createResourceScope } from './scope/resource.scope';
import { LocalizationScopeOptions, createLocalizationScope } from './scope/localization.scope';
import { createStore, getState, getStore, setStoreDevTool, Store, StoreConfig, StoreDevTool } from '@sardonyxwt/state-store';
import { createEventBus, EventBus, EventBusConfig, EventBusDevTool, getEventBus, setEventBusDevTool } from '@sardonyxwt/event-bus';
import { Container, interfaces } from 'inversify';
import { LIGUI_TYPES } from './types';
import * as React from 'react';

export * from 'inversify';
export * from './types';
export * from './context';
export * from './extension/converter.extension';
export * from './extension/entity.extension';
export * from './extension/data.extension';
export * from './extension/function.extension';
export * from './scope/module.scope';
export * from './scope/resource.scope';
export * from './scope/localization.scope';
export * from './service/jsx.service';
export * from './service/localization.service';
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
export * from './hook/translator.hook';
export * from './hook/module.hook';
export * from './hook/resource.hook';
export * from '@sardonyxwt/state-store';
export * from '@sardonyxwt/event-bus';
export * from '@sardonyxwt/utils/generator';
export * from '@sardonyxwt/utils/object';

export interface WebLiguiConfig {
  name: string;
  containerOptions: interfaces.ContainerOptions
  resourceLoader: ResourceLoader;
  resourceScopeOptions: ResourceScopeOptions;
  localizationLoader: LocalizationLoader;
  localizationScopeOptions: LocalizationScopeOptions;
  moduleLoader: ModuleLoader;
  moduleScopeOptions: ModuleScopeOptions;
}

export interface WebLigui {
  readonly jsx: JSXService;
  readonly rest: RestService;
  readonly resource: ResourceService;
  readonly localization: LocalizationService;
  readonly module: ModuleService;
  readonly context: Context;
  readonly store: Store;
  readonly container: Container;

  createStore(config: StoreConfig): Store;
  getStore(storeName: string): Store;
  getState(): {};
  setStoreDevTool(devTool: Partial<StoreDevTool>): void;

  createEventBus(config?: EventBusConfig): EventBus;
  getEventBus(scopeName: string): EventBus;
  setEventBusDevTool(devTool: Partial<EventBusDevTool>): void;

  useId: () => string;
  useRef: <T>(initialValue?: T | null) => [React.RefObject<T>, T];
  useData: <T>(dataResolver: () => T,
               dataLoader?: () => Promise<T>,
               dataSync?: (cb: (newData: T) => void) => (() => void | void)) => T;
  useState: <T = any>(scopeName: string, actions?: string[], retention?: number) => T;
  usePocket: <T extends {}>(initialValue: T) => T;
  useCurrent: <T>(valueProvider: () => T) => [T, (newValue: T) => void];
  useDependency: <T = any>(id: interfaces.ServiceIdentifier<T>, keyOrName?: ContainerKey, value?: any) => T;
  useDependencies: <T = any>(id: interfaces.ServiceIdentifier<T>, keyOrName?: ContainerKey, value?: any) => T[];
  useModule: <T = any>(key: string) => T;
  useResource: <T = any>(key: string) => T;
  useTranslator: (keys: string[]) => Translator;

  clone: <T>(source: T) => T;
  cloneArray: <T>(sources: T[]) => T[];
  cloneArrays: <T>(...sources: (T[])[]) => T[];
  copyArray: <T>(sources: T[]) => T[];
  copyArrays: <T>(...sources: (T[])[]) => T[];
  resolveArray: <T>(source: T | T[]) => T[];
  arrayFrom: <T>(...sources: (T | T[])[]) => T[];

  generateUUID: Generator<string>;
  generateSalt: Generator<string>;
  createUniqueIdGenerator: (prefix: string) => Generator<string>;

  flatten: (data: object) => object;
  unflatten: (data: object) => object;
  stringifyValue: (value) => string;
  deepFreeze: <T>(obj: T) => Readonly<T>;

  deferred: DeferredCall;

  charFromHexCode: (hexCode: string) => string;

  resolveFunctionCall: <T extends Function>(func: T, ...flags: boolean[]) => T;
  prepareFunctionCall: <T extends Function>(func: T, ...flags: boolean[]) =>
    ((...args: Parameters<typeof func>) => () => ReturnType<typeof func>);
}

export function createNewLiguiInstance(config: WebLiguiConfig): WebLigui {
  const context = createContext(config.name, config.containerOptions);

  const moduleScope = createModuleScope(context.store, config.moduleScopeOptions);
  const resourceScope = createResourceScope(context.store, config.resourceScopeOptions);
  const localizationScope = createLocalizationScope(context.store, config.localizationScopeOptions);

  context.container.bind(LIGUI_TYPES.MODULE_LOADER).toConstantValue(config.moduleLoader);
  context.container.bind(LIGUI_TYPES.RESOURCE_LOADER).toConstantValue(config.resourceLoader);
  context.container.bind(LIGUI_TYPES.LOCALIZATION_LOADER).toConstantValue(config.localizationLoader);

  context.container.bind(LIGUI_TYPES.MODULE_SCOPE).toConstantValue(moduleScope);
  context.container.bind(LIGUI_TYPES.RESOURCE_SCOPE).toConstantValue(resourceScope);
  context.container.bind(LIGUI_TYPES.LOCALIZATION_SCOPE).toConstantValue(localizationScope);

  context.container.bind<JSXService>(LIGUI_TYPES.JSX_SERVICE)
    .to(JSXServiceImpl).inSingletonScope();
  context.container.bind<RestService>(LIGUI_TYPES.REST_SERVICE)
    .to(RestServiceImpl).inSingletonScope();
  context.container.bind<ModuleService>(LIGUI_TYPES.MODULE_SERVICE)
    .to(ModuleServiceImpl).inSingletonScope();
  context.container.bind<ResourceService>(LIGUI_TYPES.RESOURCE_SERVICE)
    .to(ResourceServiceImpl).inSingletonScope();
  context.container.bind<LocalizationService>(LIGUI_TYPES.LOCALIZATION_SERVICE)
    .to(LocalizationServiceImpl).inSingletonScope();

  const ligui: WebLigui = {
    get jsx() {
      return context.container.get<JSXService>(LIGUI_TYPES.JSX_SERVICE);
    },
    get rest() {
      return context.container.get<RestService>(LIGUI_TYPES.REST_SERVICE);
    },
    get resource() {
      return context.container.get<ResourceService>(LIGUI_TYPES.RESOURCE_SERVICE);
    },
    get localization() {
      return context.container.get<LocalizationService>(LIGUI_TYPES.LOCALIZATION_SERVICE);
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
    getState: getState,
    getStore: getStore,
    setStoreDevTool: setStoreDevTool,

    createEventBus: createEventBus,
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
    useTranslator: createTranslatorHook(context.container),
    useDependency: createDependencyHook(context.container),
    useDependencies: createDependenciesHook(context.container),

    clone,
    cloneArray,
    cloneArrays,
    copyArray,
    copyArrays,
    resolveArray,
    arrayFrom,

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
