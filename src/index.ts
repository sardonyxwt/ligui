import { jsxService, JSXService } from './service/jsx.service';
import { restService, RestService } from './service/rest.service';
import { storeService, StoreService } from './service/store.service';
import { configService, ConfigService } from './service/config.service';
import { resourceService, ResourceService } from './service/resource.service';
import { navigationService, NavigationService } from './service/navigation.service';
import { localizationService, LocalizationService } from './service/localization.service';
import { ToastApi } from "./api/toast.api";
import { DialogApi } from "./api/dialog.api";
import { ContextmenuApi } from "./api/contextmenu.api";
import { NotificationApi } from "./api/notification.api";

export {
  ToastApi,
  DialogApi,
  ContextmenuApi,
  NotificationApi
}

export interface Ligui {
  jsx: JSXService;
  rest: RestService;
  store: StoreService;
  config: ConfigService;
  resource: ResourceService;
  navigation: NavigationService;
  localization: LocalizationService;
  api: {
    toast?: ToastApi
    dialog?: DialogApi
    contextmenu?: ContextmenuApi
    notification?: NotificationApi
  }
}

class LiguiImpl implements Ligui {
  jsx = jsxService;
  rest = restService;
  store = storeService;
  config = configService;
  resource = resourceService;
  navigation = navigationService;
  localization = localizationService;
  api = {};
}

export const ligui: Ligui = global['ligui'] = new LiguiImpl();
