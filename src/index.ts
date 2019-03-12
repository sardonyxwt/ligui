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
export * from './hoc/context.hoc';
export * from './hoc/state.hoc';
export * from './hoc/resources.hoc';
export * from './hoc/localization.hoc';
export * from '@sardonyxwt/state-store';
export * from '@sardonyxwt/event-bus';
export * from '@sardonyxwt/utils/generator';
export * from '@sardonyxwt/utils/json';
import 'reflect-metadata';
import { uniqueId } from '@sardonyxwt/utils/generator';
import { flatten, unflatten } from '@sardonyxwt/utils/json';
import { arrayFrom, clone, cloneArray, cloneArrays, copyArray, copyArrays, resolveArray } from './extension/entity';
import { createJSXServiceInstance, JSXService } from './service/jsx.service';
import { createRestServiceInstance, RestService } from './service/rest.service';
import { createStoreServiceInstance, StoreService } from './service/store.service';
import { createEventBusServiceInstance, EventBusService } from './service/event-bus.service';
import { createResourceServiceInstance, ResourceService } from './service/resource.service';
import { createContainerServiceInstance, ContainerService, LiguiTypes } from './service/container.service';
import { createLocalizationServiceInstance, LocalizationService } from './service/localization.service';
import { createDependencyHookInstance, createDependenciesHookInstance,
  DependencyHookType, DependenciesHookType } from './hook/dependency.hook';
import { createIdHookInstance, IdHookType } from './hook/id.hook';
import { createLocalizationHookInstance, LocalizationHookType } from './hook/localization.hook';
import { createResourceHookInstance, ResourceHookType } from './hook/resources.hook';
import { createStateHookInstance, StateHookType } from './hook/state.hook';
import { createContextHocInstance, ContextHocType } from './hoc/context.hoc';
import { createStateHocInstance, StateHocType } from './hoc/state.hoc';
import { createResourcesHocInstance, ResourcesHocType } from './hoc/resources.hoc';
import { createLocalizationHocInstance, LocalizationHocType } from './hoc/localization.hoc';
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
  id?: string;
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
  context: ContextHocType;
  localization: LocalizationHocType;
  resources: ResourcesHocType;
  state: StateHocType;
}

export interface LiguiHook {
  id: IdHookType;
  dependency: DependencyHookType;
  dependencies: DependenciesHookType;
  localization: LocalizationHookType;
  resource: ResourceHookType;
  state: StateHookType;
}

export interface Ligui extends ContainerService {
  readonly id: string;
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
  flatten(data: object): object;
  unflatten(data: object): object;
  uniqueId(prefix?, useSeed?): string;
}

const liguiInstances: Ligui[] = [];

export function getLiguiInstance(id: string) {
  return liguiInstances.find(it => it.id === id);
}

export function getAllLiguiInstance() {
  return [...liguiInstances];
}

export function createLiguiInstance(config: LiguiConfig): Ligui {
  const jsxService = createJSXServiceInstance();
  const restService = createRestServiceInstance();
  const storeService = createStoreServiceInstance();
  const eventBusService = createEventBusServiceInstance();
  const resourceService = createResourceServiceInstance();
  const localizationService = createLocalizationServiceInstance();
  const containerService = createContainerServiceInstance();

  containerService.container.bind<JSXService>(LiguiTypes.JSX_SERVICE).toConstantValue(jsxService);
  containerService.container.bind<RestService>(LiguiTypes.REST_SERVICE).toConstantValue(restService);
  containerService.container.bind<StoreService>(LiguiTypes.STORE_SERVICE).toConstantValue(storeService);
  containerService.container.bind<ResourceService>(LiguiTypes.RESOURCE_SERVICE).toConstantValue(resourceService);
  containerService.container.bind<ContainerService>(LiguiTypes.CONTAINER_SERVICE).toConstantValue(containerService);
  containerService.container.bind<LocalizationService>(LiguiTypes.LOCALIZATION_SERVICE).toConstantValue(localizationService);

  const id = config.id || uniqueId('Ligui');
  let api: LiguiApi = {};
  let hoc: LiguiHoc = {
    context: createContextHocInstance(),
    localization: createLocalizationHocInstance(localizationService),
    resources: createResourcesHocInstance(resourceService),
    state: createStateHocInstance(storeService)
  };
  let hooks: LiguiHook = {
    id: createIdHookInstance(),
    dependency: createDependencyHookInstance(containerService),
    dependencies: createDependenciesHookInstance(containerService),
    localization: createLocalizationHookInstance(localizationService),
    resource: createResourceHookInstance(resourceService),
    state: createStateHookInstance(),
  };

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

  const ligui = Object.freeze(Object.assign({
    get id() {
      return id;
    },
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
    uniqueId
  }, containerService));

  if (config.globalName) {
    global[config.globalName] = ligui;
    console.log(`Ligui registered in global scope with name: ${config.globalName}`);
  }

  liguiInstances.push(ligui);

  return ligui;
}
