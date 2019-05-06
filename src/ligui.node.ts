import 'reflect-metadata';
import { Context, createContext } from './context';
import { createUniqueIdGenerator, generateUUID, generateSalt, Generator } from '@sardonyxwt/utils/generator';
import { flatten, unflatten, deepFreeze, stringifyValue } from '@sardonyxwt/utils/object';
import { arrayFrom, clone, cloneArray, cloneArrays, copyArray, copyArrays, resolveArray } from './extension/entity';
import { charFromHexCode, deferred, DeferredCall, prepareFunctionCall, resolveFunctionCall } from './extension/function';
import { Parameters, ReturnType } from './extension/data';
import { RestServiceImpl, RestService } from './service/rest.service';
import { StoreServiceImpl, StoreService } from './service/store.service';
import { EventBusServiceImpl, EventBusService } from './service/event-bus.service';
import { ResourceServiceImpl, ResourceService } from './service/resource.service';
import { LocalizationServiceImpl, LocalizationService } from './service/localization.service';
import { ResourcePartLoader, createResourceLoader } from './loader/resource.loader';
import { LocalizationPartLoader, createLocalizationLoader } from './loader/localization.loader';
import { ResourceScopeOptions, createResourceScope } from './scope/resource.scope';
import { LocalizationScopeOptions, createLocalizationScope } from './scope/localization.scope';
import { StoreDevTool } from '@sardonyxwt/state-store';
import { EventBusDevTool } from '@sardonyxwt/event-bus';
import { interfaces } from 'inversify';
import { LIGUI_TYPES } from './types';

export * from 'inversify';
export * from './types';
export * from './context';
export * from './extension/converter';
export * from './extension/entity';
export * from './extension/data';
export * from './extension/function';
export * from './scope/localization.scope';
export * from './scope/resource.scope';
export * from './loader/localization.loader';
export * from './loader/resource.loader';
export * from './service/localization.service';
export * from './service/resource.service';
export * from './service/rest.service';
export * from './service/store.service';
export * from '@sardonyxwt/state-store';
export * from '@sardonyxwt/event-bus';
export * from '@sardonyxwt/utils/generator';
export * from '@sardonyxwt/utils/object';

export interface NodeLiguiConfig {
  name: string;
  containerOptions: interfaces.ContainerOptions
  resourcePartLoader: ResourcePartLoader;
  resourceScopeOptions: ResourceScopeOptions;
  localizationPartLoader: LocalizationPartLoader;
  localizationScopeOptions: LocalizationScopeOptions;
  storeDevTools?: Partial<StoreDevTool>;
  eventBusDevTools?: Partial<EventBusDevTool>;
}

export interface NodeLigui {
  readonly rest: RestService;
  readonly store: StoreService;
  readonly eventBus: EventBusService;
  readonly resource: ResourceService;
  readonly localization: LocalizationService;
  readonly context: Context;

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

export function createNewLiguiInstance(config: NodeLiguiConfig): NodeLigui {
  const context = createContext(config.name, config.containerOptions);

  const resourceScope = createResourceScope(context.store, config.resourceScopeOptions);
  const localizationScope = createLocalizationScope(context.store, config.localizationScopeOptions);

  const resourceLoader = createResourceLoader(resourceScope, config.resourcePartLoader);
  const localizationLoader = createLocalizationLoader(localizationScope, config.localizationPartLoader);

  context.container.bind(LIGUI_TYPES.RESOURCE_LOADER).toConstantValue(resourceLoader);
  context.container.bind(LIGUI_TYPES.LOCALIZATION_LOADER).toConstantValue(localizationLoader);

  context.container.bind(LIGUI_TYPES.RESOURCE_SCOPE).toConstantValue(resourceScope);
  context.container.bind(LIGUI_TYPES.LOCALIZATION_SCOPE).toConstantValue(localizationScope);

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

  const ligui = {
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
    get context() {
      return context;
    },

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
