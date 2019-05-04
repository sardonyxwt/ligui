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
import { useDependency, useDependencies,
  DependencyHookType, DependenciesHookType } from './hook/dependency.hook';
import { useId, IdHookType } from './hook/id.hook';
import { useLocalization, LocalizationHookType } from './hook/localization.hook';
import { useRef, RefHookType } from './hook/ref.hook';
import { useResources, ResourcesHookType } from './hook/resources.hook';
import { useState, StateHookType } from './hook/state.hook';
import { usePocket, PocketHookType } from './hook/pocket.hook';
import { ToastApi } from './api/toast.api';
import { DialogApi } from './api/dialog.api';
import { PreloaderApi } from './api/preloader.api';
import { ContextmenuApi } from './api/contextmenu.api';
import { NotificationApi } from './api/notification.api';
import { PartResourceLoader, createResourceLoader } from './loader/resource.loader';
import { PartLocalizationLoader, createLocalizationLoader } from './loader/localization.loader';
import { ResourceScopeOptions, createResourceScope } from './scope/resource.scope';
import { LocalizationScopeOptions, createLocalizationScope } from './scope/localization.scope';
import { StoreDevTool } from '@sardonyxwt/state-store';
import { EventBusDevTool } from '@sardonyxwt/event-bus';
import { interfaces } from 'inversify';
import { LiguiTypes } from '@src/types';

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
export * from './hook/dependency.hook';
export * from './hook/id.hook';
export * from './hook/localization.hook';
export * from './hook/resources.hook';
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

export interface LiguiConfig {
  name: string;
  api?: LiguiApi;
  containerOptions?: interfaces.ContainerOptions
  resourcePartLoader: PartResourceLoader;
  resourceScopeOptions: ResourceScopeOptions;
  localizationPartLoader: PartLocalizationLoader;
  localizationScopeOptions: LocalizationScopeOptions;
  storeDevTools?: Partial<StoreDevTool>;
  eventBusDevTools?: Partial<EventBusDevTool>;
}

export interface Ligui {
  readonly jsx: JSXService;
  readonly rest: RestService;
  readonly store: StoreService;
  readonly eventBus: EventBusService;
  readonly resource: ResourceService;
  readonly localization: LocalizationService;
  readonly api: LiguiApi;
  readonly context: Context;

  useId: IdHookType;
  useDependency: DependencyHookType;
  useDependencies: DependenciesHookType;
  useLocalization: LocalizationHookType;
  useResources: ResourcesHookType;
  useState: StateHookType;
  useRef: RefHookType;
  usePocket: PocketHookType;

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

export function createLigui(config: LiguiConfig, postInstall?: (ligui: Ligui) => void): Ligui {
  const context = createContext(config.name, config.containerOptions);

  const resourceScope = createResourceScope(context.store, config.resourceScopeOptions);
  const localizationScope = createLocalizationScope(context.store, config.localizationScopeOptions);

  const resourceLoader = createResourceLoader(resourceScope, config.resourcePartLoader);
  const localizationLoader = createLocalizationLoader(localizationScope, config.localizationPartLoader);

  context.container.bind(LiguiTypes.RESOURCE_LOADER).toConstantValue(resourceLoader);
  context.container.bind(LiguiTypes.LOCALIZATION_LOADER).toConstantValue(localizationLoader);

  context.container.bind(LiguiTypes.RESOURCE_SCOPE).toConstantValue(resourceScope);
  context.container.bind(LiguiTypes.LOCALIZATION_SCOPE).toConstantValue(localizationScope);

  context.container.bind<JSXService>(LiguiTypes.JSX_SERVICE)
    .to(JSXServiceImpl).inSingletonScope();
  context.container.bind<RestService>(LiguiTypes.REST_SERVICE)
    .to(RestServiceImpl).inSingletonScope();
  context.container.bind<StoreService>(LiguiTypes.STORE_SERVICE)
    .to(StoreServiceImpl).inSingletonScope();
  context.container.bind<ResourceService>(LiguiTypes.RESOURCE_SERVICE)
    .to(ResourceServiceImpl).inSingletonScope();
  context.container.bind<EventBusService>(LiguiTypes.EVENT_BUS_SERVICE)
    .to(EventBusServiceImpl).inSingletonScope();
  context.container.bind<LocalizationService>(LiguiTypes.LOCALIZATION_SERVICE)
    .to(LocalizationServiceImpl).inSingletonScope();

  const jsxService = context.container.get<JSXService>(LiguiTypes.JSX_SERVICE);
  const restService = context.container.get<RestService>(LiguiTypes.REST_SERVICE);
  const storeService = context.container.get<StoreService>(LiguiTypes.STORE_SERVICE);
  const resourceService = context.container.get<ResourceService>(LiguiTypes.RESOURCE_SERVICE);
  const eventBusService = context.container.get<EventBusService>(LiguiTypes.EVENT_BUS_SERVICE);
  const localizationService = context.container.get<LocalizationService>(LiguiTypes.LOCALIZATION_SERVICE);

  if (config.storeDevTools) {
    storeService.setStoreDevTool(config.storeDevTools);
  }

  if (config.eventBusDevTools) {
    eventBusService.setEventBusDevTool(config.eventBusDevTools);
  }

  const ligui = {
    get jsx() {
      return jsxService;
    },
    get rest() {
      return restService;
    },
    get store() {
      return storeService;
    },
    get eventBus() {
      return eventBusService;
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

    useId,
    useDependency,
    useDependencies,
    useLocalization,
    useResources,
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

  resolveFunctionCall(postInstall)(ligui);

  return ligui;
}
