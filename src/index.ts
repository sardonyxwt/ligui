import { context, ContextHOCInjectedProps } from './hoc/context.hoc';
import { subscribe, SubscribeScopeSetting } from './hoc/subscribe.hoc';
import { resource, ResourceHOCInjectedProps } from './hoc/resource.hoc';
import { localization, LocalizationHOCInjectedProps } from './hoc/localization.hoc';
import { jsxService, JSXService } from './service/jsx.service';
import { restService, RestService } from './service/rest.service';
import { storeService, StoreService } from './service/store.service';
import { resourceService, ResourceService } from './service/resource.service';
import { localizationService, LocalizationService } from './service/localization.service';
import { ToastApi } from './api/toast.api';
import { DialogApi } from './api/dialog.api';
import { ContextmenuApi } from './api/contextmenu.api';
import { NotificationApi } from './api/notification.api';
import { entity, Builder, EntityHelper } from './extension/entity';
import { Converter, DoubleSidedConverter } from './extension/converter';
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

const ligui: Ligui = new LiguiImpl();

export {
  ligui,
  JSXService,
  RestService,
  StoreService,
  ToastApi,
  DialogApi,
  ContextmenuApi,
  NotificationApi,
  context,
  subscribe,
  resource,
  localization,
  entity,
  Builder,
  EntityHelper,
  ContextHOCInjectedProps,
  SubscribeScopeSetting,
  ResourceHOCInjectedProps,
  LocalizationHOCInjectedProps,
  Converter,
  DoubleSidedConverter
}
