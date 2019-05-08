import 'reflect-metadata';
import { Context, createContext } from './context';
import { createUniqueIdGenerator, generateUUID, generateSalt, Generator } from '@sardonyxwt/utils/generator';
import { flatten, unflatten, deepFreeze, stringifyValue } from '@sardonyxwt/utils/object';
import { arrayFrom, clone, cloneArray, cloneArrays, copyArray, copyArrays, resolveArray } from './extension/entity';
import { charFromHexCode, deferred, DeferredCall, prepareFunctionCall, resolveFunctionCall } from './extension/function';
import { Parameters, ReturnType } from './extension/data';
import { JSXServiceImpl, JSXService } from './service/jsx.service';
import { RestServiceImpl, RestService } from './service/rest.service';
import { StoreServiceImpl, StoreService } from './service/store.service';
import { EventBusServiceImpl, EventBusService } from './service/event-bus.service';
import { ResourceServiceImpl, ResourceService } from './service/resource.service';
import { LocalizationServiceImpl, LocalizationService } from './service/localization.service';
import { useDependency, useDependencies, ContainerId, ContainerKey } from './hook/dependency.hook';
import { useId } from './hook/id.hook';
import { useLocalization } from './hook/localization.hook';
import { useRef } from './hook/ref.hook';
import { useResources } from './hook/resources.hook';
import { useState } from './hook/state.hook';
import { usePocket } from './hook/pocket.hook';
import { ToastApi } from './api/toast.api';
import { DialogApi } from './api/dialog.api';
import { PreloaderApi } from './api/preloader.api';
import { ContextmenuApi } from './api/contextmenu.api';
import { NotificationApi } from './api/notification.api';
import { ResourcePartLoader, createResourceLoader } from './loader/resource.loader';
import { LocalizationPartLoader, createLocalizationLoader } from './loader/localization.loader';
import { ResourceScopeOptions, createResourceScope, Resources } from './scope/resource.scope';
import { LocalizationScopeOptions, Translator, createLocalizationScope } from './scope/localization.scope';
import { Scope, Store, StoreDevTool } from '@sardonyxwt/state-store';
import { EventBusDevTool } from '@sardonyxwt/event-bus';
import { Container, interfaces } from 'inversify';
import { LIGUI_TYPES } from './types';
import * as React from 'react';

export * from 'inversify';
export * from './types';
export * from './context';
export * from './api/contextmenu.api';
export * from './api/dialog.api';
export * from './api/notification.api';
export * from './api/preloader.api';
export * from './api/toast.api';
export * from './extension/converter';
export * from './extension/entity';
export * from './extension/data';
export * from './extension/function';
export * from './scope/localization.scope';
export * from './scope/resource.scope';
export * from './loader/localization.loader';
export * from './loader/resource.loader';
export * from './service/jsx.service';
export * from './service/localization.service';
export * from './service/resource.service';
export * from './service/rest.service';
export * from './service/store.service';
export * from './hook/id.hook';
export * from './hook/state.hook';
export * from './hook/pocket.hook';
export * from './hook/ref.hook';
export * from '@sardonyxwt/state-store';
export * from '@sardonyxwt/event-bus';
export * from '@sardonyxwt/utils/generator';
export * from '@sardonyxwt/utils/object';

export interface LiguiApi {
  toast?: ToastApi;
  dialog?: DialogApi;
  preloader?: PreloaderApi;
  contextmenu?: ContextmenuApi;
  notification?: NotificationApi;
}

export interface WebLiguiConfig {
  name: string;
  api?: LiguiApi;
  containerOptions: interfaces.ContainerOptions
  resourcePartLoader: ResourcePartLoader;
  resourceScopeOptions: ResourceScopeOptions;
  localizationPartLoader: LocalizationPartLoader;
  localizationScopeOptions: LocalizationScopeOptions;
  storeDevTools?: Partial<StoreDevTool>;
  eventBusDevTools?: Partial<EventBusDevTool>;
}

export interface WebLigui extends StoreService, EventBusService {
  readonly jsx: JSXService;
  readonly rest: RestService;
  readonly resource: ResourceService;
  readonly localization: LocalizationService;
  readonly api: LiguiApi;
  readonly context: Context;
  readonly store: Store;
  readonly container: Container;

  useId: () => string;
  useRef: <T>(initialValue?: T | null) => [React.RefObject<T>, T];
  useState: <T = any>(scope: string | Scope<T>, actions?: string[], retention?: number) => T;
  usePocket: <T extends {}>(initialValue: T) => T;
  useDependency: <T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any) => T;
  useDependencies: <T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any) => T[];
  useLocalization: (keys: string[], fallbackTranslator?: Translator) => Translator;
  useResources: (keys: string[]) => Resources;

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

  const resourceScope = createResourceScope(context.store, config.resourceScopeOptions);
  const localizationScope = createLocalizationScope(context.store, config.localizationScopeOptions);

  const resourceLoader = createResourceLoader(resourceScope, config.resourcePartLoader);
  const localizationLoader = createLocalizationLoader(localizationScope, config.localizationPartLoader);

  context.container.bind(LIGUI_TYPES.RESOURCE_LOADER).toConstantValue(resourceLoader);
  context.container.bind(LIGUI_TYPES.LOCALIZATION_LOADER).toConstantValue(localizationLoader);

  context.container.bind(LIGUI_TYPES.RESOURCE_SCOPE).toConstantValue(resourceScope);
  context.container.bind(LIGUI_TYPES.LOCALIZATION_SCOPE).toConstantValue(localizationScope);

  context.container.bind<JSXService>(LIGUI_TYPES.JSX_SERVICE)
    .to(JSXServiceImpl).inSingletonScope();
  context.container.bind<RestService>(LIGUI_TYPES.REST_SERVICE)
    .to(RestServiceImpl).inSingletonScope();
  context.container.bind<StoreService>(LIGUI_TYPES.STORE_SERVICE)
    .to(StoreServiceImpl).inSingletonScope();
  context.container.bind<ResourceService>(LIGUI_TYPES.RESOURCE_SERVICE)
    .to(ResourceServiceImpl).inSingletonScope();
  context.container.bind<EventBusService>(LIGUI_TYPES.EVENT_BUS_SERVICE)
    .to(EventBusServiceImpl).inSingletonScope();
  context.container.bind<LocalizationService>(LIGUI_TYPES.LOCALIZATION_SERVICE)
    .to(LocalizationServiceImpl).inSingletonScope();

  const jsxService = context.container.get<JSXService>(LIGUI_TYPES.JSX_SERVICE);
  const restService = context.container.get<RestService>(LIGUI_TYPES.REST_SERVICE);
  const storeService = context.container.get<StoreService>(LIGUI_TYPES.STORE_SERVICE);
  const resourceService = context.container.get<ResourceService>(LIGUI_TYPES.RESOURCE_SERVICE);
  const eventBusService = context.container.get<EventBusService>(LIGUI_TYPES.EVENT_BUS_SERVICE);
  const localizationService = context.container.get<LocalizationService>(LIGUI_TYPES.LOCALIZATION_SERVICE);

  if (config.storeDevTools) {
    storeService.setStoreDevTool(config.storeDevTools);
  }

  if (config.eventBusDevTools) {
    eventBusService.setEventBusDevTool(config.eventBusDevTools);
  }

  const ligui: WebLigui = {
    get jsx() {
      return jsxService;
    },
    get rest() {
      return restService;
    },
    get resource() {
      return resourceService;
    },
    get localization() {
      return localizationService;
    },
    get api() {
      return config.api;
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

    createStore: storeService.createStore,
    getState: storeService.getState,
    getStore: storeService.getStore,
    setStoreDevTool: storeService.setStoreDevTool,

    createEventBus: eventBusService.createEventBus,
    getEventBus: eventBusService.getEventBus,
    setEventBusDevTool: eventBusService.setEventBusDevTool,

    useId,
    useDependency: <T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any) => {
      return useDependency(context, id, keyOrName, value);
    },
    useDependencies: <T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any) => {
      return useDependencies(context, id, keyOrName, value);
    },
    useLocalization: (keys: string[], fallbackTranslator?: Translator) => {
      return useLocalization(context, keys, fallbackTranslator);
    },
    useResources: (keys: string[]) => {
      return useResources(context, keys);
    },
    useState,
    useRef,
    usePocket,

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

  if (config.name) {
    global[config.name] = ligui;
  }

  return ligui;
}
