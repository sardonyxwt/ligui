export * from 'inversify';
export * from './api/contextmenu.api';
export * from './api/dialog.api';
export * from './api/notification.api';
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
export * from './hook/localization.hook';
export * from './hook/resources.hook';
export * from './hook/scope.hook';
export * from './hoc/context.hoc';
export * from './hoc/subscribe.hoc';
export * from './hoc/resource.hoc';
export * from './hoc/localization.hoc';
import 'reflect-metadata';
import { Container } from 'inversify';
import { jsxService, JSXService } from './service/jsx.service';
import { restService, RestService } from './service/rest.service';
import { storeService, StoreService } from './service/store.service';
import { resourceService, ResourceService } from './service/resource.service';
import { localizationService, LocalizationService } from './service/localization.service';
import { ToastApi } from './api/toast.api';
import { DialogApi } from './api/dialog.api';
import { ContextmenuApi } from './api/contextmenu.api';
import { NotificationApi } from './api/notification.api';
import { RLoader } from './loader/resource.loader';
import { LLoader } from './loader/localization.loader';
import { ResourceScopeConfigureActionProps } from './scope/resource.scope';
import { LocalizationScopeConfigureActionProps } from './scope/localization.scope';
import { StoreDevTool } from '@sardonyxwt/state-store';

export interface LiguiConfig {
  api?: LiguiApi;
  globalName?: string;
  resourceLoader?: RLoader;
  resourceInitState?: ResourceScopeConfigureActionProps;
  localizationLoader?: LLoader;
  localizationInitState?: LocalizationScopeConfigureActionProps;
  storeDevTools?: StoreDevTool;
}

export interface LiguiApi {
  toast?: ToastApi;
  dialog?: DialogApi;
  contextmenu?: ContextmenuApi;
  notification?: NotificationApi;
}

export enum LiguiTypes {
  JSX_SERVICE = 'LIG_JSX_SERVICE',
  REST_SERVICE = 'LIG_REST_SERVICE',
  STORE_SERVICE = 'LIG_STORE_SERVICE',
  RESOURCE_SERVICE = 'LIG_RESOURCE_SERVICE',
  LOCALIZATION_SERVICE = 'LIG_LOCALIZATION_SERVICE',

  TOAST_API = 'LIG_TOAST_APIE',
  DIALOG_API = 'LIG_DIALOG_API',
  CONTEXTMENU_API = 'LIG_CONTEXTMENU_API',
  NOTIFICATION_API = 'LIG_NOTIFICATION_API',
}

export interface Ligui {
  readonly jsx: JSXService;
  readonly rest: RestService;
  readonly store: StoreService;
  readonly resource: ResourceService;
  readonly localization: LocalizationService;
  readonly container: Container;
  readonly api: LiguiApi;
  readonly isConfigured: boolean;
  resolve<T = any>(id: string): T;
  setup(config: LiguiConfig): void;
}

let api: LiguiApi = {};
let isConfigured = false;
let container = new Container({
  skipBaseClassChecks: true,
});

container.bind<JSXService>(LiguiTypes.JSX_SERVICE).toConstantValue(jsxService);
container.bind<RestService>(LiguiTypes.REST_SERVICE).toConstantValue(restService);
container.bind<StoreService>(LiguiTypes.STORE_SERVICE).toConstantValue(storeService);
container.bind<ResourceService>(LiguiTypes.RESOURCE_SERVICE).toConstantValue(resourceService);
container.bind<LocalizationService>(LiguiTypes.LOCALIZATION_SERVICE).toConstantValue(localizationService);

class LiguiImpl implements Ligui {

  get jsx() {
   return jsxService;
  }

  get rest() {
    return restService;
  }

  get store() {
    return storeService;
  }

  get resource() {
    return resourceService;
  }

  get localization() {
    return localizationService;
  }

  get container() {
    return container;
  }

  get api() {
    return api;
  }

  get isConfigured() {
    return isConfigured;
  }

  resolve<T = any>(id: string): T {
    return container.get<T>(id);
  }

  setup(config: LiguiConfig) {
    if (isConfigured) {
      throw new Error('Ligui can configured only once.')
    }

    isConfigured = true;

    if (config.api) {
      api = config.api;
      const {toast, contextmenu, dialog, notification} = api;
      if (toast) {
        container.bind<ToastApi>(LiguiTypes.TOAST_API).toConstantValue(toast);
      }
      if (contextmenu) {
        container.bind<ContextmenuApi>(LiguiTypes.CONTEXTMENU_API).toConstantValue(contextmenu);
      }
      if (dialog) {
        container.bind<DialogApi>(LiguiTypes.DIALOG_API).toConstantValue(dialog);
      }
      if (notification) {
        container.bind<NotificationApi>(LiguiTypes.NOTIFICATION_API).toConstantValue(notification);
      }
    }
    if (config.globalName) {
      global[config.globalName] = this;
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
  }

}

export const ligui: Ligui = new LiguiImpl();
