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
import { ResourceScopeConfigureActionProps, resourceScope } from './scope/resource.scope';
import { LocalizationScopeConfigureActionProps, localizationScope } from './scope/localization.scope';
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

export interface Ligui {
  readonly jsx: JSXService;
  readonly rest: RestService;
  readonly store: StoreService;
  readonly resource: ResourceService;
  readonly localization: LocalizationService;
  readonly api: LiguiApi;
  readonly isConfigured: boolean;
  setup(config: LiguiConfig): void
}

let isConfigured = false;
let api = {};

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

  get api() {
    return api;
  }

  get isConfigured() {
    return isConfigured;
  }

  setup(config: LiguiConfig) {
    if (isConfigured) {
      throw new Error('Ligui can configured only once.')
    }

    isConfigured = true;

    if (config.api) {
      api = config.api;
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

export * from './api/contextmenu.api';
export * from './api/dialog.api';
export * from './api/notification.api';
export * from './api/toast.api';
export * from './extension/converter';
export * from './extension/entity';
export * from './hoc/localization.hoc';
export * from './hoc/resource.hoc';
export * from './hoc/subscribe.hoc';
export * from './hoc/context.hoc';
export * from './loader/localization.loader';
export * from './loader/resource.loader';
export * from './scope/localization.scope';
export * from './scope/resource.scope';
export * from './service/jsx.service';
export * from './service/localization.service';
export * from './service/resource.service';
export * from './service/rest.service';
export * from './service/store.service';
