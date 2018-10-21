import { context } from 'hoc/context.hoc';
import { connect } from 'hoc/connect.hoc';
import { jsxService, JSXService } from 'service/jsx.service';
import { restService, RestService } from 'service/rest.service';
import { storeService, StoreService } from 'service/store.service';
import { resourceService, ResourceService } from 'service/resource.service';
import { localizationService, LocalizationService } from 'service/localization.service';
import { ToastApi } from 'api/toast.api';
import { DialogApi } from 'api/dialog.api';
import { ContextmenuApi } from 'api/contextmenu.api';
import { NotificationApi } from 'api/notification.api';

export * from 'decorator/router.decorator';

export interface Ligui {
  jsx: JSXService;
  rest: RestService;
  store: StoreService;
  resource: ResourceService;
  localization: LocalizationService;
  api: {
    toast?: ToastApi
    dialog?: DialogApi
    contextmenu?: ContextmenuApi
    notification?: NotificationApi
  };
}

class LiguiImpl implements Ligui {
  jsx = jsxService;
  rest = restService;
  store = storeService;
  resource = resourceService;
  localization = localizationService;
  api = {};
}

const ligui: Ligui = new LiguiImpl();

global['ligui'] = ligui;
global['ContextHOC'] = context;
global['ConnectHOC'] = connect;

export {
  ligui,
  JSXService,
  RestService,
  StoreService,
  ResourceService,
  LocalizationService,
  ToastApi,
  DialogApi,
  ContextmenuApi,
  NotificationApi,
  context,
  connect
}
