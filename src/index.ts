export * from 'inversify';
export * from './api/contextmenu.api';
export * from './api/dialog.api';
export * from './api/notification.api';
export * from './api/preloader.api';
export * from './api/toast.api';
export * from './extension/converter';
export * from './extension/entity';
export * from './scope/localization.scope';
export * from './scope/resource.scope';
export * from './loader/localization.loader';
export * from './loader/resource.loader';
export * from './service/jsx.service';
export * from './service/localization.service';
export * from './service/resource.service';
export * from './service/rest.service';
export * from './service/store.service';
export * from './service/container.service';
export * from './hook/dependency.hook';
export * from './hook/id.hook';
export * from './hook/localization.hook';
export * from './hook/resources.hook';
export * from './hook/state.hook';
export * from './hook/ref.hook';
export * from './hoc/context.hoc';
export * from './hoc/state.hoc';
export * from './hoc/resources.hoc';
export * from './hoc/localization.hoc';
export * from '@sardonyxwt/state-store';
export * from '@sardonyxwt/event-bus';
export * from '@sardonyxwt/utils/generator';
export * from '@sardonyxwt/utils/object';
import 'reflect-metadata';
import { createUniqueIdGenerator, generateUUID, generateSalt, Generator } from '@sardonyxwt/utils/generator';
import { flatten, unflatten, deepFreeze, stringifyValue } from '@sardonyxwt/utils/object';
import { arrayFrom, clone, cloneArray, cloneArrays, copyArray, copyArrays, resolveArray } from './extension/entity';
import { jsxService, JSXService } from './service/jsx.service';
import { restService, RestService } from './service/rest.service';
import { storeService, StoreService } from './service/store.service';
import { eventBusService, EventBusService } from './service/event-bus.service';
import { resourceService, ResourceService } from './service/resource.service';
import { containerService, ContainerService, LiguiTypes } from './service/container.service';
import { localizationService, LocalizationService } from './service/localization.service';
import { useDependency, useDependencies,
  DependencyHookType, DependenciesHookType } from './hook/dependency.hook';
import { useId, IdHookType } from './hook/id.hook';
import { useLocalization, LocalizationHookType } from './hook/localization.hook';
import { useRef, RefHookType } from './hook/ref.hook';
import { useResources, ResourcesHookType } from './hook/resources.hook';
import { useState, StateHookType } from './hook/state.hook';
import { withContext, ContextHocType } from './hoc/context.hoc';
import { withState, StateHocType } from './hoc/state.hoc';
import { withResources, ResourcesHocType } from './hoc/resources.hoc';
import { withLocalization, LocalizationHocType } from './hoc/localization.hoc';
import { ToastApi } from './api/toast.api';
import { DialogApi } from './api/dialog.api';
import { PreloaderApi } from './api/preloader.api';
import { ContextmenuApi } from './api/contextmenu.api';
import { NotificationApi } from './api/notification.api';
import { RLoader } from './loader/resource.loader';
import { LLoader } from './loader/localization.loader';
import { ResourceScopeConfigureActionProps } from './scope/resource.scope';
import { LocalizationScopeConfigureActionProps } from './scope/localization.scope';
import { StoreDevTool } from '@sardonyxwt/state-store';
import { EventBusDevTool } from '@sardonyxwt/event-bus';

export interface LiguiConfig {
  api?: LiguiApi;
  globalName?: string;
  resourceLoader?: RLoader;
  resourceInitState?: ResourceScopeConfigureActionProps;
  localizationLoader?: LLoader;
  localizationInitState?: LocalizationScopeConfigureActionProps;
  storeDevTools?: Partial<StoreDevTool>;
  eventBusDevTools?: Partial<EventBusDevTool>;
  restDefaultProps?: RequestInit;
}

export interface LiguiApi {
  toast?: ToastApi;
  dialog?: DialogApi;
  preloader?: PreloaderApi;
  contextmenu?: ContextmenuApi;
  notification?: NotificationApi;
}

export interface LiguiHoc {
  withContext: ContextHocType;
  withLocalization: LocalizationHocType;
  withResources: ResourcesHocType;
  withState: StateHocType;
}

export interface LiguiHook {
  useId: IdHookType;
  useDependency: DependencyHookType;
  useDependencies: DependenciesHookType;
  useLocalization: LocalizationHookType;
  useResources: ResourcesHookType;
  useState: StateHookType;
  useRef: RefHookType;
}

export interface Ligui extends ContainerService, LiguiHoc, LiguiHook {
  readonly jsx: JSXService;
  readonly rest: RestService;
  readonly store: StoreService;
  readonly eventBus: EventBusService;
  readonly resource: ResourceService;
  readonly localization: LocalizationService;
  readonly api: LiguiApi;
  readonly hoc: LiguiHoc;
  readonly hook: LiguiHook;
  clone: <T>(source: T) => T;
  cloneArray: <T>(sources: T[]) => T[];
  cloneArrays: <T>(...sources: (T[])[]) => T[];
  copyArray: <T>(sources: T[]) => T[];
  copyArrays: <T>(...sources: (T[])[]) => T[];
  resolveArray: <T>(source: T | T[]) => T[];
  arrayFrom: <T>(...sources: (T | T[])[]) => T[];
  generateUUID: Generator<string>;
  generateSalt: Generator<string>;
  flatten(data: object): object;
  unflatten(data: object): object;
  stringifyValue(value): string;
  deepFreeze<T>(obj: T): Readonly<T>;
  resolveFunctionCall<T extends Function>(func: T, ...flags: boolean[]): T;
  prepareFunctionCall<T extends Function>(func: T, ...flags: boolean[]):
    ((...args: Parameters<typeof func>) => () => ReturnType<typeof func>);
  createUniqueIdGenerator(prefix: string): Generator<string>;
  charFromHexCode(hexCode: string): string;
}

export let ligui: Ligui = null;

export type Parameters<T> = T extends (... args: infer T) => any ? T : never;
export type ReturnType<T> = T extends (... args: any[]) => infer T ? T : never;

// ToDo move to utils package
export const resolveFunctionCall = <T extends Function>(func: T, ...flags: boolean[]): T =>
  !func || flags.findIndex(it => !it) >= 0 ? (() => null) as any : func;

// ToDo move to utils package
export const prepareFunctionCall = <T extends Function>(func: T, ...flags: boolean[]):
  ((...args: Parameters<typeof func>) => () => ReturnType<typeof func>) =>
  !func || flags.findIndex(it => !it) >= 0 ? (() => () => null) as any : (...args) => () => func(...args);

// ToDo move to utils package
export const charFromHexCode = hexCode => String.fromCharCode(parseInt(hexCode, 16));

let api: LiguiApi = {};
let hoc: LiguiHoc = {
  withContext,
  withLocalization,
  withResources,
  withState
};
let hooks: LiguiHook = {
  useId,
  useDependency,
  useDependencies,
  useLocalization,
  useResources,
  useState,
  useRef
};

export function setupLigui(config: LiguiConfig): void {
  if (ligui) {
    throw new Error('Ligui can setup only once.');
  }

  containerService.container.bind<JSXService>(LiguiTypes.JSX_SERVICE).toConstantValue(jsxService);
  containerService.container.bind<RestService>(LiguiTypes.REST_SERVICE).toConstantValue(restService);
  containerService.container.bind<StoreService>(LiguiTypes.STORE_SERVICE).toConstantValue(storeService);
  containerService.container.bind<ResourceService>(LiguiTypes.RESOURCE_SERVICE).toConstantValue(resourceService);
  containerService.container.bind<ContainerService>(LiguiTypes.CONTAINER_SERVICE).toConstantValue(containerService);
  containerService.container.bind<LocalizationService>(LiguiTypes.LOCALIZATION_SERVICE).toConstantValue(localizationService);

  if (config.api) {
    api = config.api;
    const {toast, contextmenu, preloader, dialog, notification} = api;
    if (toast) {
      containerService.container.bind<ToastApi>(LiguiTypes.TOAST_API).toConstantValue(toast);
    }
    if (contextmenu) {
      containerService.container.bind<ContextmenuApi>(LiguiTypes.CONTEXTMENU_API).toConstantValue(contextmenu);
    }
    if (preloader) {
      containerService.container.bind<PreloaderApi>(LiguiTypes.PRELOADER_API).toConstantValue(preloader);
    }
    if (dialog) {
      containerService.container.bind<DialogApi>(LiguiTypes.DIALOG_API).toConstantValue(dialog);
    }
    if (notification) {
      containerService.container.bind<NotificationApi>(LiguiTypes.NOTIFICATION_API).toConstantValue(notification);
    }
  }
  if (config.resourceLoader) {
    resourceService.loader = config.resourceLoader;
  }
  if (config.resourceInitState) {
    resourceService.configure(config.resourceInitState);
  }
  if (config.localizationLoader) {
    localizationService.loader = config.localizationLoader;
  }
  if (config.localizationInitState) {
    localizationService.configure(config.localizationInitState);
  }
  if (config.storeDevTools) {
    storeService.setStoreDevTool(config.storeDevTools);
  }
  if (config.eventBusDevTools) {
    eventBusService.setEventBusDevTool(config.eventBusDevTools);
  }
  if (config.restDefaultProps) {
    restService.defaultProps = config.restDefaultProps;
  }

  ligui = Object.freeze(Object.assign({
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
      return api;
    },
    get hoc() {
      return hoc;
    },
    get hook() {
      return hooks;
    },
    clone,
    cloneArray,
    cloneArrays,
    copyArray,
    copyArrays,
    resolveArray,
    arrayFrom,
    flatten,
    unflatten,
    deepFreeze,
    stringifyValue,
    generateUUID,
    generateSalt,
    resolveFunctionCall,
    prepareFunctionCall,
    createUniqueIdGenerator,
    charFromHexCode
  }, containerService, hoc, hooks));

  if (config.globalName) {
    global[config.globalName] = ligui;
    console.log(`Ligui registered in global scope with name: ${config.globalName}`);
  }
}
